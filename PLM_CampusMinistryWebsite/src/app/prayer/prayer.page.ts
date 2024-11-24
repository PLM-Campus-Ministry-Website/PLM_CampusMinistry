import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './prayer.page.html',
  styleUrls: ['./prayer.page.scss'],
})
export class PrayerPage {
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
            // Add your search logic here
          },
        },
      ],
    });

    await alert.present();
  }
}
