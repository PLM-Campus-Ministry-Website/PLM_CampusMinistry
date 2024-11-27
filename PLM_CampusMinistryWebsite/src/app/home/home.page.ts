import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  // Form data model
  request = {
    name: '',
    college: '',
    dateTime: '',
    event: '',
    place: '',
    customPlace: '',  // For custom place input
    attendees: 1,     // Added attendees property with a default value of 1
    otherPlace: '',   // Added otherPlace property for custom places
    notes: ''
  };

  // Using an array instead of a fixed object type
  visibleAnswers: boolean[] = new Array(8).fill(false);

  constructor(private alertCtrl: AlertController) {}

  // Form submission handler
  onSubmit() {
    // Check if required fields are filled
    if (this.request.name && this.request.college && this.request.event && this.request.dateTime && this.request.place) {
      const emailSubject = 'Mass Schedule Request';

      // Get current date and time
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();

      // Handle custom place
      const place = this.request.place === 'Other' && this.request.customPlace ? this.request.customPlace : this.request.place;

      // Construct the email body in a formal letter format
      const emailBody = `
        Dear Ms. Angel Macasaet,

        I hope this email finds you well.

        I am writing to request the scheduling of a mass for the following details:

        College: ${this.request.college}
        Event: ${this.request.event}
        Date and Time: ${this.request.dateTime}
        Number of Attendees: ${this.request.attendees}
        Place: ${place}
        Additional Notes: ${this.request.notes || 'None'}

        The request was made on: ${formattedDate}

        Kindly confirm the scheduled time at your earliest convenience.

        Thank you for your time and attention to this matter.

        Sincerely,
        ${this.request.name}
      `;

      // Construct the mailto link with the subject and body
      const mailToLink = `mailto:yurialfrance05@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Trigger the email client to open with the pre-filled message
      window.location.href = mailToLink;

      // Optionally, you can show a success message (if you want to indicate the action was triggered)
      this.showConfirmationAlert();
    } else {
      // If the required fields are not filled out, show an error message
      this.showErrorAlert();
    }
  }

  // Error alert if fields are missing
  showErrorAlert() {
    alert('Please fill out all required fields.');
  }

  // Confirmation alert after sending email
  showConfirmationAlert() {
    alert('Your request has been sent! Please check your email client.');
  }

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
            // Add your search logic here, like sending to a service or making an API call
          },
        },
      ],
    });

    await alert.present();
  }

  // Toggle visibility of FAQ answers
  toggleAnswer(questionNumber: number) {
    this.visibleAnswers[questionNumber - 1] = !this.visibleAnswers[questionNumber - 1];
  }

  // Check if an FAQ answer is visible
  isAnswerVisible(questionNumber: number): boolean {
    return this.visibleAnswers[questionNumber - 1];
  }
}
