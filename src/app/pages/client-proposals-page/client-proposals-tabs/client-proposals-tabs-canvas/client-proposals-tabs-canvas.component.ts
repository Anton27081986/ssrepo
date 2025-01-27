import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {CommonModule, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
	selector: 'app-client-proposals-tabs-canvas',
	templateUrl: './client-proposals-tabs-canvas.component.html',
	styleUrls: ['./client-proposals-tabs-canvas.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		LoaderComponent,
		NgTemplateOutlet,
		NgIf
	],
	standalone: true
})
export class ClientProposalsTabsCanvasComponent {
	@Input() headerTemplateRef: TemplateRef<any> | null = null;
	@Input() bodyTemplateRef: TemplateRef<any> | null = null;
	@Input() footerTemplateRef: TemplateRef<any> | null = null;
	@Input() isLoader: boolean = false;
}
