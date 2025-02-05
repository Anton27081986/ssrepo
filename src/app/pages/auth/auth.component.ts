import { UntilDestroy } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import {CardComponent} from "@app/shared/components/card/card.component";
import {RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@UntilDestroy()
@Component({
	selector: 'ss-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	imports: [
		CardComponent,
		RouterOutlet,
		NgOptimizedImage
	],
	standalone: true
})
export class AuthComponent {}
