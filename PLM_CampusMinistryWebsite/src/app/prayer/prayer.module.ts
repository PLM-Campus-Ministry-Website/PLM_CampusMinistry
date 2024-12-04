import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrayerPage } from './prayer.page';
import { PrayerPageRoutingModule } from './prayer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerPageRoutingModule
  ],
  declarations: [PrayerPage]
})
export class PrayerPageModule {}
