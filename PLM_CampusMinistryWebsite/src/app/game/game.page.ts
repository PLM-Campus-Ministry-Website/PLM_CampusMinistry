import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  selectedGame: string = '';

  constructor() { }

  ngOnInit() {
    console.log("Game page initialized");
  }

  toggleGame(game: string) {
    if (this.selectedGame === game) {
      this.selectedGame = ''; // Deselect game if already selected
    } else {
      this.selectedGame = game;
    }
  }

  toggleFullScreen(game: string) {
    const iframe = document.querySelector(`iframe[src*="${game}"]`) as HTMLIFrameElement;

    if (iframe) {
      const doc: any = iframe;

      if (doc.requestFullscreen) {
        doc.requestFullscreen();
      } else if (doc.mozRequestFullScreen) { // Firefox
        doc.mozRequestFullScreen();
      } else if (doc.webkitRequestFullscreen) { // Chrome, Safari, Opera
        doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) { // IE/Edge
        doc.msRequestFullscreen();
      }
    }
  }
}
