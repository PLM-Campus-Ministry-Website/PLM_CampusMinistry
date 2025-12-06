import { Component, OnInit } from '@angular/core';
import { RosaryDataService, RosaryPrayers } from './rosary-data.service';

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
  selector: 'app-rosary',
  templateUrl: './rosary.page.html',
  styleUrls: ['./rosary.page.scss'],
})
export class RosaryPage implements OnInit {
  currentLanguage: Language = 'english';
  currentMysteryType: MysteryType = 'joyful';
  prayers: RosaryPrayers | null = null;
  beads: Bead[] = [];
  currentBeadIndex: number = 0;
  currentDecade: number = 0;
  showPrayerModal: boolean = false;
  currentPrayerText: string = '';
  currentPrayerTitle: string = '';
  showLanguageSelector: boolean = false;
  showMysterySelector: boolean = false;

  constructor(private rosaryData: RosaryDataService) {}

  ngOnInit() {
    this.loadPrayers();
    this.initializeRosary();
  }

  loadPrayers() {
    this.prayers = this.rosaryData.getPrayers(this.currentLanguage);
    this.initializeRosary();
  }

  initializeRosary() {
    if (!this.prayers) return;

    this.beads = [];
    let beadId = 0;

    // Cross - Sign of the Cross
    this.beads.push({
      id: beadId++,
      type: 'cross',
      title: this.prayers.signOfTheCross.title,
      prayer: this.prayers.signOfTheCross.text,
      isCompleted: false,
      isActive: false
    });

    // Our Father (first)
    this.beads.push({
      id: beadId++,
      type: 'our-father',
      title: this.prayers.ourFather.title,
      prayer: this.prayers.ourFather.text,
      isCompleted: false,
      isActive: false
    });

    // Three Hail Marys (Faith, Hope, Charity)
    for (let i = 0; i < 3; i++) {
      this.beads.push({
        id: beadId++,
        type: 'hail-mary',
        title: this.prayers.hailMary.title,
        prayer: this.prayers.hailMary.text,
        isCompleted: false,
        isActive: false
      });
    }

    // Glory Be
    this.beads.push({
      id: beadId++,
      type: 'glory-be',
      title: this.prayers.gloryBe.title,
      prayer: this.prayers.gloryBe.text,
      isCompleted: false,
      isActive: false
    });

    // Five Decades
    for (let decade = 0; decade < 5; decade++) {
      // Mystery (Our Father)
      this.beads.push({
        id: beadId++,
        type: 'mystery',
        title: `${this.prayers.mysteries[this.currentMysteryType][decade]}`,
        prayer: `${this.prayers.mysteries[this.currentMysteryType][decade]}\n\n${this.prayers.ourFather.text}`,
        isCompleted: false,
        isActive: false
      });

      // Ten Hail Marys
      for (let i = 0; i < 10; i++) {
        this.beads.push({
          id: beadId++,
          type: 'hail-mary',
          title: this.prayers.hailMary.title,
          prayer: this.prayers.hailMary.text,
          isCompleted: false,
          isActive: false
        });
      }

      // Glory Be (and optional Fatima Prayer)
      this.beads.push({
        id: beadId++,
        type: 'glory-be',
        title: this.prayers.gloryBe.title,
        prayer: `${this.prayers.gloryBe.text}\n\n${this.prayers.fatimaPrayer.text}`,
        isCompleted: false,
        isActive: false
      });
    }

    // Center - Hail Holy Queen
    this.beads.push({
      id: beadId++,
      type: 'center',
      title: this.prayers.hailHolyQueen.title,
      prayer: this.prayers.hailHolyQueen.text,
      isCompleted: false,
      isActive: false
    });

    // Set first bead as active
    if (this.beads.length > 0) {
      this.beads[0].isActive = true;
      this.currentBeadIndex = 0;
    }
  }

  onBeadClick(bead: Bead) {
    if (bead.id === this.currentBeadIndex) {
      // Show prayer for current bead
      this.currentPrayerTitle = bead.title;
      this.currentPrayerText = bead.prayer;
      this.showPrayerModal = true;
    } else if (bead.id < this.currentBeadIndex || bead.isCompleted) {
      // Allow going back to completed beads
      this.currentBeadIndex = bead.id;
      this.updateBeadStates();
      this.currentPrayerTitle = bead.title;
      this.currentPrayerText = bead.prayer;
      this.showPrayerModal = true;
    }
  }

  nextBead() {
    if (this.currentBeadIndex < this.beads.length - 1) {
      this.beads[this.currentBeadIndex].isCompleted = true;
      this.beads[this.currentBeadIndex].isActive = false;
      this.currentBeadIndex++;
      this.beads[this.currentBeadIndex].isActive = true;
      
      const currentBead = this.beads[this.currentBeadIndex];
      this.currentPrayerTitle = currentBead.title;
      this.currentPrayerText = currentBead.prayer;
      this.showPrayerModal = true;
    }
  }

  previousBead() {
    if (this.currentBeadIndex > 0) {
      this.beads[this.currentBeadIndex].isActive = false;
      this.currentBeadIndex--;
      this.beads[this.currentBeadIndex].isActive = true;
      
      const currentBead = this.beads[this.currentBeadIndex];
      this.currentPrayerTitle = currentBead.title;
      this.currentPrayerText = currentBead.prayer;
      this.showPrayerModal = true;
    }
  }

  updateBeadStates() {
    this.beads.forEach((bead, index) => {
      bead.isActive = index === this.currentBeadIndex;
      bead.isCompleted = index < this.currentBeadIndex;
    });
  }

  closePrayerModal() {
    this.showPrayerModal = false;
  }

  changeLanguage(language: Language) {
    this.currentLanguage = language;
    this.loadPrayers();
    this.showLanguageSelector = false;
  }

  changeMysteryType(type: MysteryType) {
    this.currentMysteryType = type;
    this.initializeRosary();
    this.showMysterySelector = false;
  }

  resetRosary() {
    this.currentBeadIndex = 0;
    this.initializeRosary();
    this.showPrayerModal = false;
  }

  getLanguageLabel(lang: Language): string {
    const labels = {
      english: 'English',
      tagalog: 'Tagalog',
      latin: 'Latin'
    };
    return labels[lang];
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

  getProgress(): number {
    if (this.beads.length === 0) return 0;
    return Math.round((this.currentBeadIndex / this.beads.length) * 100);
  }
}




