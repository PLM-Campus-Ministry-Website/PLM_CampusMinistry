import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RosaryPage } from './rosary.page';

const routes: Routes = [
  {
    path: '',
    component: RosaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RosaryPageRoutingModule {}




