import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "@app/shared/components/header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
	templateUrl: './full-width-without-footer-layout.component.html',
	styleUrls: ['./full-width-without-footer-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeaderComponent,
		RouterOutlet
	],
	standalone: true
})
export class FullWidthWithoutFooterLayoutComponent {}
