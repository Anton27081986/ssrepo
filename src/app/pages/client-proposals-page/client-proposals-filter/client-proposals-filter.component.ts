import { Component } from '@angular/core';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

@Component({
	selector: 'app-client-proposals-filter',
	styleUrls: ['client-proposals-filter.component.scss'],
	templateUrl: './client-proposals-filter.component.html',
	imports: [
		HeadlineComponent,
		SearchInputComponent,
		ButtonComponent
	],
	standalone: true
})
export class ClientProposalsFilterComponent {}
