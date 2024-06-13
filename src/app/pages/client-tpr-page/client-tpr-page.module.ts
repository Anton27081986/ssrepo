import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { ClientTprPageRoutingModule } from './client-tpr-page.routing.module';
import { ClientTprPageComponent } from './client-tpr-page.component';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';

@NgModule({
	declarations: [ClientTprPageComponent],
	imports: [CommonModule, ClientTprPageRoutingModule, HeadlineModule, SearchInputModule],
})
export class ClientTprPageModule {}
