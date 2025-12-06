import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeditationPageRoutingModule } from './meditation-routing.module';

import { MeditationPage } from './meditation.page';
import { PdfReaderComponent } from './pdf-reader/pdf-reader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeditationPageRoutingModule
  ],
  declarations: [MeditationPage, PdfReaderComponent]
})
export class MeditationPageModule {}
