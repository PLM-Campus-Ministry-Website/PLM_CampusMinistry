import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Set up PDF.js worker - using CDN version
const PDFJS_VERSION = '3.11.174';
const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

// Declare PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface Annotation {
  id: string;
  type: 'highlight' | 'pen';
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  points?: Array<{ x: number; y: number }>;
}

interface Bookmark {
  id: string;
  page: number;
  title: string;
  timestamp: number;
}

@Component({
  selector: 'app-pdf-reader',
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('annotationCanvas', { static: false }) annotationCanvas!: ElementRef<HTMLCanvasElement>;

  pdfPath: string = '';
  pdfDoc: any = null;
  currentPage: number = 1;
  totalPages: number = 0;
  scale: number = 1.5;
  password: string = '';
  isPasswordEntered: boolean = false;
  isPasswordCorrect: boolean = false;
  passwordInput: string = '';
  isLoading: boolean = false;
  loadError: string = '';
  isFullscreen: boolean = false;

  // Annotation tools
  selectedTool: 'none' | 'highlight' | 'pen' | 'bookmark' = 'none';
  highlightColor: string = '#FFFF00';
  penColor: string = '#000000';
  penSize: number = 2;
  isDrawing: boolean = false;
  startX: number = 0;
  startY: number = 0;

  annotations: Annotation[] = [];
  bookmarks: Bookmark[] = [];
  currentBookmark: Bookmark | null = null;

  highlightColors: string[] = ['#FFFF00', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA'];
  penColors: string[] = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF'];

  // Swipe gesture tracking
  swipeStartX: number = 0;
  swipeStartY: number = 0;
  swipeStartTime: number = 0;
  isSwipeGesture: boolean = false;
  readonly SWIPE_THRESHOLD: number = 50; // Minimum distance for swipe
  readonly SWIPE_TIME_THRESHOLD: number = 300; // Maximum time for swipe (ms)

  Math = Math; // Make Math available in template

  private readonly CORRECT_PASSWORD = 'KuyaJosephGanda2025';
  private readonly STORAGE_PREFIX = 'pdf_reader_';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.pdfCanvas && this.annotationCanvas) {
        this.setupAnnotationCanvas();
      }
    }, 100);
  }

  verifyPassword() {
    if (this.passwordInput === this.CORRECT_PASSWORD) {
      this.isPasswordCorrect = true;
      this.isPasswordEntered = true;
      this.loadPdf();
    } else {
      this.showAlert('Incorrect Password', 'Please enter the correct password to access this PDF.');
      this.passwordInput = '';
    }
  }

  async loadPdf() {
    if (!this.isPasswordCorrect && !this.isPasswordEntered) {
      return;
    }

    if (!this.pdfPath) {
      this.showAlert('Error', 'No PDF path provided.');
      return;
    }

    this.isLoading = true;
    this.loadError = '';

    try {
      // Dynamically load PDF.js from CDN if not available
      if (typeof (window as any).pdfjsLib === 'undefined') {
        console.log('Loading PDF.js from CDN...');
        await this.loadPdfJs();
      }

      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) {
        throw new Error('PDF.js library failed to load. Please check your internet connection.');
      }

      console.log('PDF.js loaded successfully');
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

      // Ensure the path is correct for Angular assets
      let pdfUrl = this.pdfPath;
      // Remove any leading/trailing whitespace
      pdfUrl = pdfUrl.trim();
      
      // If it's a relative path, ensure it starts with / for Angular assets
      if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://') && !pdfUrl.startsWith('/')) {
        pdfUrl = '/' + pdfUrl;
      }
      
      // For Angular dev server, assets are served from root
      // Replace 'assets/' with '/assets/' if needed
      if (pdfUrl.includes('assets/') && !pdfUrl.startsWith('/assets/')) {
        pdfUrl = pdfUrl.replace('assets/', '/assets/');
      }

      // Encode the URL properly for special characters
      // Split the path and encode only the filename part
      let finalPdfUrl = pdfUrl;
      try {
        const urlParts = pdfUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const pathWithoutFilename = urlParts.slice(0, -1).join('/');
        // Encode the filename to handle special characters (spaces, parentheses, apostrophes, etc.)
        const encodedFilename = encodeURIComponent(filename);
        finalPdfUrl = pathWithoutFilename + '/' + encodedFilename;
      } catch (e) {
        console.warn('Error encoding filename, using original:', e);
        // Fallback: encode the entire URL
        finalPdfUrl = encodeURI(pdfUrl);
      }

      console.log('Loading PDF from:', finalPdfUrl);
      console.log('Original path:', this.pdfPath);

      // First, try to fetch the file to check if it exists
      try {
        const response = await fetch(finalPdfUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`File not found (HTTP ${response.status}). Please ensure the PDF file exists at: ${finalPdfUrl}`);
        }
      } catch (fetchError: any) {
        console.warn('HEAD request failed, trying to load anyway:', fetchError);
        // Continue anyway, sometimes HEAD requests fail but GET works
      }

      const loadingTask = pdfjs.getDocument({
        url: finalPdfUrl,
        httpHeaders: {},
        withCredentials: false
      });

      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      console.log(`PDF loaded successfully. Total pages: ${this.totalPages}`);
      
      this.currentPage = this.getSavedPage() || 1;
      await this.renderPage(this.currentPage);
      setTimeout(() => {
        this.setupAnnotationCanvas();
        this.drawAnnotations();
      }, 100);
      
      this.isLoading = false;
    } catch (error: any) {
      console.error('Error loading PDF:', error);
      this.isLoading = false;
      
      let errorMessage = 'Failed to load PDF. ';
      
      if (error.name === 'PasswordException') {
        errorMessage = 'This PDF is password protected.';
      } else if (error.name === 'MissingPDFException' || error.message?.includes('Missing PDF')) {
        // Reconstruct the URL for error message
        let errorUrl = this.pdfPath.trim();
        if (!errorUrl.startsWith('http://') && !errorUrl.startsWith('https://') && !errorUrl.startsWith('/')) {
          errorUrl = '/' + errorUrl;
        }
        if (errorUrl.includes('assets/') && !errorUrl.startsWith('/assets/')) {
          errorUrl = errorUrl.replace('assets/', '/assets/');
        }
        
        errorMessage = `PDF file not found at: ${errorUrl}\n\n` +
          `Please ensure:\n` +
          `1. The PDF file exists in the src/assets/pdf/ folder\n` +
          `2. The filename in the code matches the actual filename\n` +
          `3. The file path is correct (case-sensitive)\n\n` +
          `Current path: ${this.pdfPath}`;
      } else if (error.message && error.message.includes('File not found')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else if (error.toString) {
        errorMessage += error.toString();
      } else {
        errorMessage += `Please check the file path: ${this.pdfPath}`;
      }
      
      this.loadError = errorMessage;
      this.showAlert('PDF Not Found', errorMessage);
    }
  }

  private loadPdfJs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="pdf.js"]`);
      if (existingScript) {
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if ((window as any).pdfjsLib) {
            clearInterval(checkInterval);
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
      script.async = true;
      
      script.onload = () => {
        if ((window as any).pdfjsLib) {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
          resolve();
        } else {
          reject(new Error('PDF.js loaded but not available'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load PDF.js from CDN'));
      };
      
      document.head.appendChild(script);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!(window as any).pdfjsLib) {
          reject(new Error('PDF.js loading timeout'));
        }
      }, 10000);
    });
  }

  async renderPage(pageNum: number) {
    if (!this.pdfDoc) return;

    try {
      const page = await this.pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = this.pdfCanvas.nativeElement;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      this.currentPage = pageNum;
      this.saveCurrentPage();
      
      // Update annotation canvas after rendering
      setTimeout(() => {
        this.setupAnnotationCanvas();
        this.drawAnnotations();
      }, 50);
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  }

  setupAnnotationCanvas() {
    const canvas = this.annotationCanvas?.nativeElement;
    const pdfCanvas = this.pdfCanvas?.nativeElement;
    
    if (canvas && pdfCanvas && pdfCanvas.width > 0 && pdfCanvas.height > 0) {
      canvas.width = pdfCanvas.width;
      canvas.height = pdfCanvas.height;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.renderPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.renderPage(this.currentPage + 1);
    }
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.renderPage(pageNum);
    }
  }

  onPageInputChange(event: any) {
    const pageNum = parseInt(event.target.value, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
      this.goToPage(pageNum);
    } else {
      // Reset to current page if invalid
      event.target.value = this.currentPage;
    }
  }

  zoomIn() {
    this.scale += 0.25;
    this.renderPage(this.currentPage);
  }

  zoomOut() {
    if (this.scale > 0.5) {
      this.scale -= 0.25;
      this.renderPage(this.currentPage);
    }
  }

  selectTool(tool: 'none' | 'highlight' | 'pen' | 'bookmark') {
    if (tool === 'bookmark') {
      this.addBookmark();
    } else {
      this.selectedTool = tool;
    }
  }

  toggleFullscreen() {
    const container = document.querySelector('.pdf-reader-container');
    if (!container) return;

    if (!this.isFullscreen) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  ngOnInit() {
    // Listen for fullscreen changes
    const updateFullscreen = () => {
      this.isFullscreen = !!(document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement);
    };

    document.addEventListener('fullscreenchange', updateFullscreen);
    document.addEventListener('webkitfullscreenchange', updateFullscreen);
    document.addEventListener('mozfullscreenchange', updateFullscreen);
    document.addEventListener('MSFullscreenChange', updateFullscreen);

    // Keyboard shortcuts
    document.addEventListener('keydown', this.keyDownHandler);

    this.route.queryParams.subscribe(params => {
      let path = params['path'] || '';
      // Decode the path if it's URL encoded
      try {
        this.pdfPath = decodeURIComponent(path);
      } catch (e) {
        // If decoding fails, use as-is
        this.pdfPath = path;
      }
      if (this.pdfPath) {
        this.loadPdf();
      }
    });
    this.loadAnnotations();
    this.loadBookmarks();
  }

  ngOnDestroy() {
    // Remove event listeners
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  private keyDownHandler = (event: KeyboardEvent) => this.handleKeyDown(event);

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isPasswordCorrect) return;
    
    // Don't trigger shortcuts when typing in input fields
    if ((event.target as HTMLElement).tagName === 'INPUT') return;

    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousPage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextPage();
        break;
      case '+':
      case '=':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.zoomIn();
        }
        break;
      case '-':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.zoomOut();
        }
        break;
      case 'f':
      case 'F':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.toggleFullscreen();
        }
        break;
      case 'Escape':
        if (this.isFullscreen) {
          this.toggleFullscreen();
        }
        break;
    }
  }

  getCanvasCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.annotationCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if (event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  onCanvasMouseDown(event: MouseEvent) {
    if (this.selectedTool === 'none') return;
    event.preventDefault();
    const coords = this.getCanvasCoordinates(event);
    this.handleCanvasDown(coords.x, coords.y);
  }

  onCanvasTouchStart(event: TouchEvent) {
    if (event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      this.swipeStartX = touch.clientX;
      this.swipeStartY = touch.clientY;
      this.swipeStartTime = Date.now();
      this.isSwipeGesture = false;
    }

    // If tool is 'none', allow swipe gestures
    if (this.selectedTool === 'none') {
      return; // Don't prevent default to allow swipe
    }

    event.preventDefault();
    const coords = this.getCanvasCoordinates(event);
    this.handleCanvasDown(coords.x, coords.y);
  }

  handleCanvasDown(x: number, y: number) {

    if (this.selectedTool === 'pen') {
      this.isDrawing = true;
      this.startX = x;
      this.startY = y;
      const annotation: Annotation = {
        id: this.generateId(),
        type: 'pen',
        page: this.currentPage,
        x: x,
        y: y,
        color: this.penColor,
        points: [{ x, y }]
      };
      this.annotations.push(annotation);
      this.drawPen(annotation);
    } else if (this.selectedTool === 'highlight') {
      this.isDrawing = true;
      this.startX = x;
      this.startY = y;
    }
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();
    const coords = this.getCanvasCoordinates(event);
    this.handleCanvasMove(coords.x, coords.y);
  }

  onCanvasTouchMove(event: TouchEvent) {
    // Check if this is a swipe gesture (when tool is 'none')
    if (this.selectedTool === 'none' && event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.swipeStartX);
      const deltaY = Math.abs(touch.clientY - this.swipeStartY);
      
      // If horizontal movement is greater than vertical, it's likely a swipe
      if (deltaX > deltaY && deltaX > 10) {
        this.isSwipeGesture = true;
      }
      return; // Don't prevent default for swipe gestures
    }

    if (!this.isDrawing) return;
    event.preventDefault();
    if (event.touches && event.touches.length > 0) {
      const coords = this.getCanvasCoordinates(event);
      this.handleCanvasMove(coords.x, coords.y);
    }
  }

  handleCanvasMove(x: number, y: number) {

    if (this.selectedTool === 'pen') {
      const lastAnnotation = this.annotations[this.annotations.length - 1];
      if (lastAnnotation && lastAnnotation.points) {
        lastAnnotation.points.push({ x, y });
        this.drawPen(lastAnnotation);
      }
    }
  }

  onCanvasMouseUp(event: MouseEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();
    const coords = this.getCanvasCoordinates(event);
    this.handleCanvasUp(coords.x, coords.y);
  }

  onCanvasTouchEnd(event: TouchEvent) {
    // Handle swipe gesture when tool is 'none'
    if (this.selectedTool === 'none' && event.changedTouches && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - this.swipeStartX;
      const deltaY = touch.clientY - this.swipeStartY;
      const deltaTime = Date.now() - this.swipeStartTime;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if it's a valid swipe gesture
      if (this.isSwipeGesture && 
          absDeltaX > this.SWIPE_THRESHOLD && 
          absDeltaX > absDeltaY && 
          deltaTime < this.SWIPE_TIME_THRESHOLD) {
        event.preventDefault();
        
        // Swipe left = next page, Swipe right = previous page
        if (deltaX < 0) {
          // Swipe left - next page
          this.nextPage();
        } else {
          // Swipe right - previous page
          this.previousPage();
        }
        return;
      }
    }

    if (!this.isDrawing) return;
    event.preventDefault();
    const canvas = this.annotationCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;
    
    if (event.changedTouches && event.changedTouches.length > 0) {
      x = event.changedTouches[0].clientX - rect.left;
      y = event.changedTouches[0].clientY - rect.top;
    } else {
      x = this.startX;
      y = this.startY;
    }
    
    this.handleCanvasUp(x, y);
  }

  // Container-level swipe handlers (for when tool is 'none')
  onContainerTouchStart(event: TouchEvent) {
    if (this.selectedTool === 'none' && event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      this.swipeStartX = touch.clientX;
      this.swipeStartY = touch.clientY;
      this.swipeStartTime = Date.now();
      this.isSwipeGesture = false;
    }
  }

  onContainerTouchMove(event: TouchEvent) {
    if (this.selectedTool === 'none' && event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.swipeStartX);
      const deltaY = Math.abs(touch.clientY - this.swipeStartY);
      
      // If horizontal movement is greater than vertical, it's likely a swipe
      if (deltaX > deltaY && deltaX > 10) {
        this.isSwipeGesture = true;
      }
    }
  }

  onContainerTouchEnd(event: TouchEvent) {
    if (this.selectedTool === 'none' && event.changedTouches && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - this.swipeStartX;
      const deltaY = touch.clientY - this.swipeStartY;
      const deltaTime = Date.now() - this.swipeStartTime;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if it's a valid swipe gesture
      if (this.isSwipeGesture && 
          absDeltaX > this.SWIPE_THRESHOLD && 
          absDeltaX > absDeltaY && 
          deltaTime < this.SWIPE_TIME_THRESHOLD) {
        event.preventDefault();
        
        // Swipe left = next page, Swipe right = previous page
        if (deltaX < 0) {
          // Swipe left - next page
          this.nextPage();
        } else {
          // Swipe right - previous page
          this.previousPage();
        }
      }
    }
  }

  handleCanvasUp(x: number, y: number) {

    if (this.selectedTool === 'highlight') {
      const width = Math.abs(x - this.startX);
      const height = Math.abs(y - this.startY);
      const annotation: Annotation = {
        id: this.generateId(),
        type: 'highlight',
        page: this.currentPage,
        x: Math.min(this.startX, x),
        y: Math.min(this.startY, y),
        width: width,
        height: height,
        color: this.highlightColor
      };
      this.annotations.push(annotation);
      this.drawHighlight(annotation);
      this.saveAnnotations();
    }

    this.isDrawing = false;
  }

  drawPen(annotation: Annotation) {
    const canvas = this.annotationCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !annotation.points) return;

    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = this.penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
    for (let i = 1; i < annotation.points.length; i++) {
      ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
    }
    ctx.stroke();
  }

  drawHighlight(annotation: Annotation) {
    const canvas = this.annotationCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = annotation.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0);
    ctx.globalAlpha = 1.0;
  }

  drawAnnotations() {
    const canvas = this.annotationCanvas.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw annotations for current page
    const pageAnnotations = this.annotations.filter(a => a.page === this.currentPage);
    pageAnnotations.forEach(annotation => {
      if (annotation.type === 'highlight') {
        this.drawHighlight(annotation);
      } else if (annotation.type === 'pen' && annotation.points) {
        this.drawPen(annotation);
      }
    });
  }

  addBookmark() {
    const bookmark: Bookmark = {
      id: this.generateId(),
      page: this.currentPage,
      title: `Page ${this.currentPage}`,
      timestamp: Date.now()
    };
    this.bookmarks.push(bookmark);
    this.saveBookmarks();
    this.showAlert('Bookmark Added', `Bookmark added for page ${this.currentPage}`);
  }

  goToBookmark(bookmark: Bookmark) {
    this.renderPage(bookmark.page);
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter(b => b.id !== bookmark.id);
    this.saveBookmarks();
  }

  clearAnnotations() {
    this.annotations = this.annotations.filter(a => a.page !== this.currentPage);
    this.saveAnnotations();
    this.drawAnnotations();
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveAnnotations() {
    const key = `${this.STORAGE_PREFIX}annotations_${this.getPdfId()}`;
    localStorage.setItem(key, JSON.stringify(this.annotations));
  }

  saveToCache() {
    this.saveAnnotations();
    this.saveBookmarks();
    this.saveCurrentPage();
    this.showAlert('Saved', 'All annotations, bookmarks, and page position have been saved to browser cache.');
  }

  loadAnnotations() {
    const key = `${this.STORAGE_PREFIX}annotations_${this.getPdfId()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      this.annotations = JSON.parse(saved);
    }
  }

  saveBookmarks() {
    const key = `${this.STORAGE_PREFIX}bookmarks_${this.getPdfId()}`;
    localStorage.setItem(key, JSON.stringify(this.bookmarks));
  }

  loadBookmarks() {
    const key = `${this.STORAGE_PREFIX}bookmarks_${this.getPdfId()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      this.bookmarks = JSON.parse(saved);
    }
  }

  saveCurrentPage() {
    const key = `${this.STORAGE_PREFIX}page_${this.getPdfId()}`;
    localStorage.setItem(key, this.currentPage.toString());
  }

  getSavedPage(): number | null {
    const key = `${this.STORAGE_PREFIX}page_${this.getPdfId()}`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : null;
  }

  getPdfId(): string {
    // Use PDF path as ID, but sanitize it
    return btoa(this.pdfPath).replace(/[^a-zA-Z0-9]/g, '_');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/meditation']);
  }
}

