import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeditationPage } from './meditation.page';
import { PdfReaderComponent } from './pdf-reader/pdf-reader.component';

const routes: Routes = [
  {
    path: '',
    component: MeditationPage
  },
  {
    path: 'pdf-reader',
    component: PdfReaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeditationPageRoutingModule {}
