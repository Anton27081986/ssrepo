import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';

@Component({
	selector: 'app-transport',
	templateUrl: './transport.component.html',
	styleUrls: ['./transport.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportComponent {
	public constructor(private readonly apiService: ApiService) {}
}
