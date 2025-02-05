import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "@app/shared/components/header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: 'app-without-footer-layout',
	templateUrl: './without-footer-layout.component.html',
	styleUrls: ['./without-footer-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeaderComponent,
		RouterOutlet
	],
	standalone: true
})
export class WithoutFooterLayoutComponent {}
