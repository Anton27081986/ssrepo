import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { Title } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	public constructor(private readonly titleService: Title) {
		this.titleService.setTitle(`${environment.tabTitle} ${environment.applicationTitle}`);
	}
}
