import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-without-footer-layout',
	templateUrl: './without-footer-layout.component.html',
	styleUrls: ['./without-footer-layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithoutFooterLayoutComponent {}
