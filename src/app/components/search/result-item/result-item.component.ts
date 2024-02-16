import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { CallPhoneService } from '@app/core/services/call-phone.service';

@Component({
	selector: 'app-result-item',
	templateUrl: './result-item.component.html',
	styleUrls: ['./result-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
	@Input() user: any;

	public constructor(private readonly callPhoneService: CallPhoneService) {}
	public toggleCallForUser() {
		this.callPhoneService.toggleCallForUser(this.user);
	}
}
