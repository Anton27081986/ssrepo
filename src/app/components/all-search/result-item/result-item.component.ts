import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CallPhoneService } from '@app/core/services/call-phone.service';

@Component({
	selector: 'app-result-item',
	templateUrl: './result-item.component.html',
	styleUrls: ['./result-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
	@Input() public user: any;

	public constructor(private readonly callPhoneService: CallPhoneService) {}
	public toggleCallForUser() {
		this.callPhoneService.toggleCallForUser(this.user);
	}
}
