import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RosaryPage } from './rosary.page';
import { RosaryPageRoutingModule } from './rosary-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RosaryPageRoutingModule
  ],
  declarations: [RosaryPage]
})
export class RosaryPageModule {}




