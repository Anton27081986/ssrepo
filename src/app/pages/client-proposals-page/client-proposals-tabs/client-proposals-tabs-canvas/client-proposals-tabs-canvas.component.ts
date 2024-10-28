import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'app-client-proposals-tabs-canvas',
	templateUrl: './client-proposals-tabs-canvas.component.html',
	styleUrls: ['./client-proposals-tabs-canvas.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsTabsCanvasComponent {
	@Input() headerTemplateRef: TemplateRef<any> | null = null;
	@Input() bodyTemplateRef: TemplateRef<any> | null = null;
	@Input() footerTemplateRef: TemplateRef<any> | null = null;
	@Input() isLoader: boolean = false;
}
