import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
	selector: 'ss-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconComponent],
	standalone: true,
})
export class LoaderComponent {}
