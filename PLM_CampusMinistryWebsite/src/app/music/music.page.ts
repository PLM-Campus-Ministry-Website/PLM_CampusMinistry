import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage {
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
