import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-prayer',
  templateUrl: './prayer.page.html',
  styleUrls: ['./prayer.page.scss'],
})
export class PrayerPage {
  isModalOpen: boolean = false; // Controls modal visibility
  modalTitle: string = '';      // Stores modal title
  modalDetails: string = '';    // Stores modal details

  constructor(private alertCtrl: AlertController) {}

  // Method to open a search bar alert
  async openSearch() {
    const alert = await this.alertCtrl.create({
      header: 'Search',
      inputs: [
        {
          name: 'searchTerm',
          type: 'text',
          placeholder: 'Enter search term...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Search',
          handler: (data) => {
            console.log('Searching for:', data.searchTerm);
            // Add your search logic here (e.g., filter prayers based on searchTerm)
          },
        },
      ],
    });

    await alert.present();
  }

// Prayer Details
morningPrayer = `
As the sun rises and fills the world with light, I pause to acknowledge the gift of this new day. Thank You, Divine Source, for the breath in my lungs and the strength in my body. Grant me the wisdom to make choices that bring goodness into the world, the courage to face challenges with grace, and the humility to accept help when I need it.
May my actions today reflect kindness and understanding. Let my words be a source of comfort and encouragement to others. Help me to find joy in the small moments—a warm smile, a kind word, or the beauty of nature.
As I journey through this day, guide my heart to gratitude and my mind to clarity. Keep me mindful of the opportunities to learn, grow, and contribute to the well-being of those around me. Thank You for this fresh start, and may I use it wisely.
`;

eveningPrayer = `
As the sun sets and the world grows quiet, I take this moment to reflect on the day that has passed. Thank You, Divine Presence, for the experiences I encountered—both the moments of joy and the lessons in challenge. I am grateful for the people I met, the opportunities I received, and the strength I found within myself.
For the times I fell short, I ask for forgiveness. Help me to learn from my mistakes and strive to be better tomorrow. For the blessings I received, I offer my thanks. May I carry these moments in my heart as reminders of Your constant care and guidance.
As I prepare for rest, I release my worries and fears, trusting that tomorrow will bring new hope and possibilities. Bless my loved ones and keep them safe through the night. Surround me with peace and renewal so that I may wake refreshed and ready for another day. Thank You for being my light in times of darkness.
`;

thanksgivingPrayer = `
Divine Creator, today I come before You with a heart overflowing with gratitude. Thank You for the many blessings You have bestowed upon me—some I see clearly, and others I may not even recognize.
I am grateful for the love and support of those around me, the opportunities to grow and learn, and the moments of peace that remind me of Your presence. Thank You for the beauty of the world—the sunrise, the laughter of children, the kindness of strangers, and the warmth of friendship.
Even in times of difficulty, I see Your hand guiding me toward strength and understanding. Thank You for teaching me resilience and for reminding me to trust in the journey, even when the path seems uncertain.
Help me to live with a grateful heart, sharing my blessings with others and spreading kindness wherever I go. May I always remember that gratitude is a powerful force, one that brings light and joy into every aspect of my life.
`;

healingPrayer = `
Divine Healer, I come to You with a heart that seeks comfort and restoration. You know the pain I carry, whether it is of the body, mind, or spirit. I ask for Your healing touch to soothe my wounds and renew my strength.
Grant me patience as I navigate this journey toward wholeness. Teach me to trust the process of healing, even when progress feels slow. Surround me with people who bring encouragement, care, and hope. May I find peace in their presence and strength in their words.
Help me to release any fear or doubt that may hold me back from embracing wellness. Instead, fill my heart with courage, my mind with positivity, and my spirit with resilience. Let me find beauty in the small victories along the way and hope in the promise of brighter days ahead.
Thank You for the strength I have found in past struggles and for the renewal that is yet to come. In this moment, I surrender my pain to You and trust in the power of Your love to make me whole again.
`;

forgivenessPrayer = `
Divine Spirit of Compassion, I stand before You with a heart that seeks forgiveness. I know I have made mistakes, spoken words I regret, and acted in ways that may have caused harm to others or myself. I ask for Your understanding and grace to cleanse me of these burdens.
Help me to learn from my shortcomings and to grow into a better version of myself. Teach me to forgive not only others but also myself, so that I may move forward with a heart unburdened by guilt or resentment.
May I also extend forgiveness to those who have hurt me. Though it is not always easy, I know that forgiveness is a gift I give to myself as well as to them. Let my spirit be free from anger and bitterness, and let love and understanding take their place.
Thank You for Your constant mercy and for the chance to begin anew each day. Guide me as I seek to live with integrity, kindness, and humility.
`;

peacePrayer = `
Source of Peace and Harmony, in this moment, I turn to You seeking calm for my restless heart and mind. The world around me feels heavy with chaos, and I long for the tranquility that comes from Your presence.
Teach me to let go of the worries I cannot control and to trust in the unfolding of Your greater plan. Fill me with a deep and abiding sense of peace that transcends all circumstances. May this peace radiate outward, touching the lives of those around me and fostering harmony in my relationships.</p>
Help me to be a peacemaker in a world that often feels divided. May my words bring comfort, my actions inspire unity, and my heart remain open to understanding.
Thank You for being a steady anchor in times of turmoil. With You, I find the courage to face challenges, the wisdom to seek solutions, and the love to heal wounds. May Your peace guide me today and always.
`;
  
  // Opens the modal with specific prayer details
  openModal(title: string, details: string): void {
    this.modalTitle = title;
    this.modalDetails = details;
    this.isModalOpen = true;
  }

  // Closes the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.modalTitle = '';
    this.modalDetails = '';
  }
}
