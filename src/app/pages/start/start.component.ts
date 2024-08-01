import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
	public loading = false;

	public constructor(private readonly userStateService: UserProfileStoreService) {}

	public ngOnInit() {
		this.loading = true;

		this.userStateService.userProfile$
			.pipe(first())
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.loading = false;
			});
	}
}
