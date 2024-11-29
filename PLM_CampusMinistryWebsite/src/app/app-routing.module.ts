import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'prayer',
    loadChildren: () => import('./prayer/prayer.module').then(m => m.PrayerPageModule)
  },
  {
    path: 'meditation',
    loadChildren: () => import('./meditation/meditation.module').then(m => m.MeditationPageModule)
  },
  {
    path: 'music',
    loadChildren: () => import('./music/music.module').then(m => m.MusicPageModule)
  },
  {
    path: 'game',  // Add route for the game page
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
