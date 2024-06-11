import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { ClientsTprRoutingModule } from './clients-tpr.routing.module';
import { ClientsTprComponent } from './clients-tpr.component';

@NgModule({
	declarations: [ClientsTprComponent],
	imports: [CommonModule, ClientsTprRoutingModule, HeadlineModule],
})
export class ClientsTprModule {}
