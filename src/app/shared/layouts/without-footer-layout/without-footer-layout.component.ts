import { ChangeDetectionStrategy, Component } from '@angular/core';
import {HeaderComponent} from "@app/shared/components/new-header/header.component";
import {RouterOutlet} from "@angular/router";
import {NzContentComponent, NzLayoutComponent} from "ng-zorro-antd/layout";

@Component({
	selector: 'app-without-footer-layout',
	templateUrl: './without-footer-layout.component.html',
	styleUrls: ['./without-footer-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeaderComponent,
		RouterOutlet,
		NzContentComponent,
		NzLayoutComponent
	],
	standalone: true
})
export class WithoutFooterLayoutComponent {}
