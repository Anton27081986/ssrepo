import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamplesPageRoutingModule } from './samples-page-routing.module';
import { SamplesPageComponent } from './samples-page.component';


@NgModule({
  declarations: [
    SamplesPageComponent
  ],
  imports: [
    CommonModule,
    SamplesPageRoutingModule
  ]
})
export class SamplesPageModule { }
