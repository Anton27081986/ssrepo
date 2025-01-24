import { UntilDestroy } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import {CardComponent} from "@app/shared/components/card/card.component";
import {RouterOutlet} from "@angular/router";

@UntilDestroy()
@Component({
	selector: 'ss-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	imports: [
		CardComponent,
		RouterOutlet
	],
	standalone: true
})
export class AuthComponent {}
