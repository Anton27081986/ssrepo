import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-recommendation-vgp',
	templateUrl: './clients-tpr.component.html',
	styleUrls: ['./clients-tpr.component.scss'],
})
export class ClientsTprComponent {}
