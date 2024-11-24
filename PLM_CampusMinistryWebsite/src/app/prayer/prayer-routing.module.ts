import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayerPage } from './prayer.page';

const routes: Routes = [
  {
    path: '',
    component: PrayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayerPageRoutingModule {}
