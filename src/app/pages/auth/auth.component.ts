import { UntilDestroy } from '@ngneat/until-destroy';
import { Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'ss-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {}
