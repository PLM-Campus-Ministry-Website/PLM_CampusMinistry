import { Injectable } from '@angular/core';

export interface Certificate {
  courseId: number;
  courseTitle: string;
  userName: string;
  completionDate: string;
  certificateId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly STORAGE_KEY = 'course_certificates';

  generateCertificate(courseId: number, courseTitle: string, userName: string): Certificate {
    const certificate: Certificate = {
      courseId,
      courseTitle,
      userName,
      completionDate: new Date().toISOString(),
      certificateId: `CERT_${courseId}_${Date.now()}`
    };

    // Save certificate
    const certificates = this.getAllCertificates();
    certificates.push(certificate);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(certificates));

    return certificate;
  }

  getAllCertificates(): Certificate[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getCertificatesForUser(userId: string): Certificate[] {
    // For now, we'll use userName to identify users
    const certificates = this.getAllCertificates();
    return certificates; // Return all for now, can filter by user later
  }

  hasCertificate(courseId: number): boolean {
    const certificates = this.getAllCertificates();
    return certificates.some(c => c.courseId === courseId);
  }

  downloadCertificateAsImage(certificate: Certificate): void {
    // Load logo image first
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    
    logoImg.onload = () => {
      this.drawCertificate(certificate, logoImg);
    };
    
    logoImg.onerror = () => {
      // If logo fails to load, draw without it
      this.drawCertificate(certificate, null);
    };
    
    // Try to load logo from assets
    logoImg.src = 'assets/cmlogo.png';
  }

  private drawCertificate(certificate: Certificate, logoImg: HTMLImageElement | null): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size (A4 ratio: 210mm x 297mm at 96 DPI = 794 x 1123 pixels)
    canvas.width = 1200;
    canvas.height = 848; // Adjusted for better proportions

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#F5F5DC'); // Beige
    gradient.addColorStop(1, '#FFF8DC'); // Cornsilk
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner border
    ctx.strokeStyle = '#D7CCC8';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Header Section
    const headerY = 100;
    ctx.fillStyle = '#5D4037';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Archdiocese of Manila', canvas.width / 2, headerY);
    
    ctx.fillStyle = '#6D4C41';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText('Pamantasan ng Lungsod ng Maynila', canvas.width / 2, headerY + 30);

    // Logo (if loaded)
    if (logoImg) {
      const logoSize = 120;
      const logoX = canvas.width / 2 - logoSize / 2;
      const logoY = headerY + 50;
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    }

    // Decorative elements (crosses in corners)
    ctx.fillStyle = '#8D6E63';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Top corners
    ctx.fillText('✞', 100, 100);
    ctx.fillText('✞', canvas.width - 100, 100);
    // Bottom corners
    ctx.fillText('✞', 100, canvas.height - 100);
    ctx.fillText('✞', canvas.width - 100, canvas.height - 100);

    // Title
    const titleY = logoImg ? headerY + 200 : headerY + 120;
    ctx.fillStyle = '#5D4037';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, titleY);

    // Subtitle
    ctx.fillStyle = '#8D6E63';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('This is to certify that', canvas.width / 2, titleY + 60);

    // Name line (blank for user to fill)
    const nameY = titleY + 120;
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    const nameLineWidth = 400;
    const nameLineX = canvas.width / 2 - nameLineWidth / 2;
    ctx.beginPath();
    ctx.moveTo(nameLineX, nameY);
    ctx.lineTo(nameLineX + nameLineWidth, nameY);
    ctx.stroke();

    // Course completion text
    ctx.fillStyle = '#6D4C41';
    ctx.font = '28px Georgia, serif';
    ctx.fillText('has successfully completed the course', canvas.width / 2, nameY + 60);

    // Course title
    ctx.fillStyle = '#5D4037';
    ctx.font = 'bold 32px Georgia, serif';
    const maxWidth = canvas.width - 200;
    const courseTitle = this.wrapText(ctx, certificate.courseTitle, maxWidth);
    let yPos = nameY + 120;
    courseTitle.forEach(line => {
      ctx.fillText(line, canvas.width / 2, yPos);
      yPos += 40;
    });

    // Date
    ctx.fillStyle = '#8D6E63';
    ctx.font = '20px Georgia, serif';
    const date = new Date(certificate.completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(`Completed on ${date}`, canvas.width / 2, yPos + 40);

    // Signature lines
    const signatureY = canvas.height - 180;
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    
    // Left signature
    ctx.beginPath();
    ctx.moveTo(200, signatureY);
    ctx.lineTo(400, signatureY);
    ctx.stroke();
    ctx.fillStyle = '#6D4C41';
    ctx.font = '18px Georgia, serif';
    ctx.fillText('Campus Ministry Director', 300, signatureY + 30);

    // Right signature
    ctx.beginPath();
    ctx.moveTo(canvas.width - 400, signatureY);
    ctx.lineTo(canvas.width - 200, signatureY);
    ctx.stroke();
    ctx.fillText('Course Coordinator', canvas.width - 300, signatureY + 30);

    // Certificate ID (small, bottom)
    ctx.fillStyle = '#A1887F';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Certificate ID: ${certificate.certificateId}`, canvas.width / 2, canvas.height - 60);

    // Convert to image and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate_${certificate.courseTitle.replace(/[^a-z0-9]/gi, '_')}_${certificate.certificateId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }

  private wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

