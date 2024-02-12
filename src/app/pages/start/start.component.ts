import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { UserStateService } from '@app/core/states/user-state.service';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
	public loading = false;

	public constructor(private readonly userStateService: UserStateService) {}

	public ngOnInit() {
		this.loading = true;

		this.userStateService.userProfile$.pipe(first()).subscribe(() => {
			this.loading = false;
		});
	}
}
