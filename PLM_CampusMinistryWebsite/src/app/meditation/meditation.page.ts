import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RosaryDataService, RosaryPrayers } from '../rosary/rosary-data.service';

interface Book {
  name: string;
  description?: string;
  filePath?: string; // Path to PDF file (e.g., 'assets/books/book-name.pdf')
}

export type Language = 'english' | 'tagalog' | 'latin';
export type MysteryType = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export interface Bead {
  id: number;
  type: 'cross' | 'our-father' | 'hail-mary' | 'glory-be' | 'mystery' | 'center';
  prayer: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-meditation',
  templateUrl: './meditation.page.html',
  styleUrls: ['./meditation.page.scss'],
})
export class MeditationPage implements OnInit {
  isModalOpen: boolean = false;
  modalTitle: string = '';
  modalDetails: string = '';
  openFolders: Set<string> = new Set(); // No folders open by default

  meditationMusics: Array<{ title: string; embedUrl: string }> = [
    // Add meditation music items here later
    // Example format:
    // { title: 'Music Title', embedUrl: 'https://open.spotify.com/embed/track/...' }
  ];

  rosaryItems: Array<{ title: string; embedUrl: string }> = [
    // Add rosary items here later
    // Example format:
    // { title: 'Rosary Title', embedUrl: 'https://open.spotify.com/embed/playlist/...' }
  ];

  // Rosary functionality
  currentLanguage: Language = 'english';
  currentMysteryType: MysteryType = 'joyful';
  prayers: RosaryPrayers | null = null;
  showMysterySelector: boolean = false;
  
  getMysteries(): string[] {
    if (!this.prayers) return [];
    return this.prayers.mysteries[this.currentMysteryType];
  }
  
  getRosaryGuide(language: Language): string {
    const prayers = this.rosaryData.getPrayers(language);
    return this.formatRosaryGuide(prayers);
  }
  
  formatRosaryGuide(prayers: RosaryPrayers): string {
    let guide = '';
    
    // Introduction
    guide += 'HOW TO PRAY THE ROSARY\n\n';
    guide += 'Begin the rosary by stating your prayer intentions.\n\n';
    
    // Sign of the Cross
    guide += '1. ' + prayers.signOfTheCross.title + '\n';
    guide += prayers.signOfTheCross.text + '\n\n';
    
    // Apostles' Creed
    guide += '2. ' + prayers.apostlesCreed.title + '\n';
    guide += prayers.apostlesCreed.text + '\n\n';
    
    // Our Father
    guide += '3. ' + prayers.ourFather.title + '\n';
    guide += prayers.ourFather.text + '\n\n';
    
    // Three Hail Marys
    guide += '4. Three ' + prayers.hailMary.title + 's (for Faith, Hope, and Charity)\n';
    guide += prayers.hailMary.text + '\n\n';
    
    // Glory Be
    guide += '5. ' + prayers.gloryBe.title + '\n';
    guide += prayers.gloryBe.text + '\n\n';
    
    // Five Decades
    guide += 'THE FIVE DECADES:\n\n';
    for (let i = 0; i < 5; i++) {
      guide += `DECADE ${i + 1}: ${prayers.mysteries[this.currentMysteryType][i]}\n\n`;
      guide += '• Announce the Mystery and pray ' + prayers.ourFather.title + '\n';
      guide += prayers.ourFather.text + '\n\n';
      guide += '• Pray 10 ' + prayers.hailMary.title + 's\n';
      guide += prayers.hailMary.text + '\n\n';
      guide += '• ' + prayers.gloryBe.title + '\n';
      guide += prayers.gloryBe.text + '\n\n';
      guide += '• ' + prayers.fatimaPrayer.title + ' (Optional)\n';
      guide += prayers.fatimaPrayer.text + '\n\n';
    }
    
    // Hail Holy Queen
    guide += '6. ' + prayers.hailHolyQueen.title + '\n';
    guide += prayers.hailHolyQueen.text + '\n\n';
    
    // Closing
    guide += 'End with Sign of the Cross.\n';
    
    return guide;
  }

  books: Book[] = [
    { 
      name: 'Contemplating the Trinity', 
      description: 'The Path to the Abundant Christian Life by Raniero Cantalamessa', 
      filePath: 'assets/pdf/___Contemplating-the-Trinity-the-Path-to-the-Abundant-Christian-Life-Raniero-Cantalamessa.pdf' 
    },
    { 
      name: 'The Trinity: An Introduction', 
      description: 'Understanding the mystery of the Trinity by Emery & Levering', 
      filePath: 'assets/pdf/___The Trinity_ An Introduction t - Emery, Gilles, O.P. & Levering.pdf' 
    },
    { 
      name: 'Holy Trinity (DE DEO UNO ET TRINO)', 
      description: 'Theological study on the Trinity', 
      filePath: 'assets/pdf/__HOLY TRINITY (DE DEO UNO ET TRINO).pdf' 
    },
    { 
      name: 'Beginning Apologetics', 
      description: 'Introduction to Catholic apologetics', 
      filePath: 'assets/pdf/Beginning-Apologetics-1-pdf (2).pdf' 
    },
    { 
      name: 'Biblical Defense of Catholicism', 
      description: 'Biblical foundations of Catholic faith by Dave Armstrong', 
      filePath: 'assets/pdf/Biblical-Defense-of-Catholicism-Dave-Armstrong.pdf' 
    },
    { 
      name: 'Catechism for Filipino Catholics', 
      description: 'Catholic catechism for Filipino faithful', 
      filePath: 'assets/pdf/Catechism for Filipino Catholics.pdf' 
    },
    { 
      name: 'The Salvation Controversy', 
      description: 'Understanding salvation in Catholic teaching by James Akin', 
      filePath: 'assets/pdf/The Salvation Controversy by James Akin  Jimmy Akin [Akin, James] (z-lib.org).pdf' 
    },
    { 
      name: 'The Woman Who Changed the Face', 
      description: 'A study on Mary and her role', 
      filePath: 'assets/pdf/The Woman Who Changed the Face of the Hemisphere.pdf' 
    },
    { 
      name: 'The Divinity and Humanity of Christ', 
      description: 'Understanding Christ\'s nature', 
      filePath: 'assets/pdf/THE-DIVINITY-HUMANITY-OF-CHRIST.pdf' 
    }
  ];

  openPdfReader(book: Book): void {
    if (book.filePath) {
      // Angular router will handle encoding automatically
      this.router.navigate(['/meditation/pdf-reader'], {
        queryParams: { path: book.filePath }
      });
    }
  }

  constructor(
    private rosaryData: RosaryDataService,
    private router: Router
  ) { }

  ngOnInit() {
    // Initialization logic can go here
    this.loadRosaryPrayers();
  }

  loadRosaryPrayers() {
    this.prayers = this.rosaryData.getPrayers(this.currentLanguage);
  }

  changeLanguage(language: Language) {
    this.currentLanguage = language;
    this.loadRosaryPrayers();
  }

  changeMysteryType(type: MysteryType) {
    this.currentMysteryType = type;
    this.loadRosaryPrayers();
    this.showMysterySelector = false;
  }

  getMysteryLabel(type: MysteryType): string {
    const labels = {
      joyful: 'Joyful Mysteries',
      luminous: 'Luminous Mysteries',
      sorrowful: 'Sorrowful Mysteries',
      glorious: 'Glorious Mysteries'
    };
    return labels[type];
  }

  toggleFolder(folderKey: string) {
    if (this.openFolders.has(folderKey)) {
      this.openFolders.delete(folderKey);
    } else {
      this.openFolders.add(folderKey);
    }
  }

  isOpen(folderKey: string): boolean {
    return this.openFolders.has(folderKey);
  }

  openSearch() {
    console.log('Search button clicked');
  }

  morningPrayer = `
    <span style='font-size:100px;'>&#127807;</span>
    <p>Meditation is a practice where an individual uses a technique - such as mindfulness, or focusing the mind on a particular object, thought, or activity - to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state.</p>
    <p>It can also be a practice of quiet reflection and deep contemplation, focusing on God's word and presence.</p>
    <p>Meditation can involve sitting quietly, breathing deeply, and focusing on a word, phrase, or sensation. </p>
    <p>We can meditate on scripture, internalize God's teachings and gain spiritual insights. This practice helps to cultivate a sense of peace, clarity, and inner strength, drawing one closer to God's love and wisdom.</p>
    <p>Regular practice can lead to a deeper understanding of oneself and a stronger relationship with God.</p>
    <p>Embrace this sacred time to reflect, pray, and find solace in His presence.</p>
    <br><br><br><br><br>
  `;

  eveningPrayer = `
    <span style='font-size:100px;'>&#127807;</span>
    <p>Meditation offers numerous benefits that contribute to overall well-being.</p>
    <p>It offers a profound way to deepen one's relationship with God. By setting aside time for quiet reflection and prayer, believers can experience a sense of peace and clarity that transcends daily distractions.
    <p>This practice helps to cultivate a mindful presence, allowing individuals to become more attuned to the voice of God and His guidance in their lives.</p>
    <p>The benefits of Christian meditation include reduced stress and anxiety, as it encourages resting in God's presence and trusting in His plan. It enhances emotional well-being by fostering a heart of gratitude and contentment through contemplation of God's blessings.</p>
    <p>Meditation also boosts emotional health by increasing self-awareness and fostering a positive outlook on life.</p>
    <p>Physically, it can promote relaxation and improve overall health. Spiritually, it strengthens faith, reinforces the teachings of Scripture, and provides a foundation for a deeper, more intimate connection with God.</p>
    <p>Embracing the practice of meditation can lead to a more balanced, joyful, and spiritually enriched life.</p>
    <br><br><br>
  `;

  thanksgivingPrayer = `
    <span style='font-size:100px;'>&#127807;</span>
    <p>Breathing exercises are simple techniques designed to improve the way you breathe, enhance your lung capacity, and promote relaxation.</p>
    <p>They involve consciously regulating your breathing patterns to achieve a state of calm and focus.
    <p>These exercises can help reduce stress, lower blood pressure, and improve overall respiratory health.</p>
    <p>Common techniques include diaphragmatic breathing, where you breathe deeply into your abdomen, and box breathing, which involves inhaling, holding, exhaling, and pausing for equal counts.</p>
    <p>Breathing exercises can also increase mindfulness, helping you stay present and aware of your body and surroundings.</p>
    <p>Incorporating these exercises into your daily routine can lead to better physical health and mental well-being.</p>
    <br><br><br><br><br>
  `;

  openModal(title: string, details: string): void {
    this.modalTitle = title;
    this.modalDetails = details;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalTitle = '';
    this.modalDetails = '';
  }
}
