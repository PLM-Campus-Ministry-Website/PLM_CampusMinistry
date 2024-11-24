import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meditation',
  templateUrl: './meditation.page.html',
  styleUrls: ['./meditation.page.scss'],
})
export class MeditationPage implements OnInit {

  constructor() { }

  ngOnInit() {
    // Initialization logic can go here
  }

  // Add the openSearch method
  openSearch() {
    console.log('Search button clicked');
    // You can add actual search functionality here if needed
  }
}
