import { ChangeDetectionStrategy, Component } from '@angular/core';
import {HeaderComponent} from "@app/shared/components/new-header/header.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "@app/shared/components/footer/footer.component";

@Component({
	selector: 'app-new-layout',
	templateUrl: './new-layout.component.html',
	styleUrls: ['./new-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeaderComponent,
		RouterOutlet,
		FooterComponent
	],
	standalone: true
})
export class NewLayoutComponent {}
