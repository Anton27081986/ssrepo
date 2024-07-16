import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ThemeService } from '@app/shared/theme/theme.service';
import { tap } from 'rxjs';
import { ProfileService } from '@app/pages/profile/profile.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
	public switchValue!: boolean;

	public constructor(
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
		private readonly changeDetector: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.profileService
			.getTheme()
			.pipe(
				tap(value => {
					this.switchValue = value.isDarkTheme;
					this.changeDetector.detectChanges();
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public toggleTheme(): void {
		this.themeService.toggleTheme().then();

		if (this.switchValue) {
			this.profileService.changeTheme(1);
		} else {
			this.profileService.changeTheme(0);
		}
	}
}
