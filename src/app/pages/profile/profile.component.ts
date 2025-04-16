import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
} from '@angular/core';
import { ThemeService } from '@app/shared/theme/theme.service';
import { tap } from 'rxjs';
import { ProfileService } from '@app/pages/profile/profile.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { ToggleComponent } from '@app/shared/components/toggle/toggle.component';

@UntilDestroy()
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		NgIf,
		FormsModule,
		RouterOutlet,
		IconComponent,
		ToggleComponent,
		RouterLinkActive,
	],
	standalone: true,
})
export class ProfileComponent implements OnInit {
	public switchValue!: boolean;

	constructor(
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
		private readonly changeDetector: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.profileService
			.getTheme()
			.pipe(
				tap((value) => {
					this.switchValue = value.isDarkTheme;
					this.changeDetector.detectChanges();
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public toggleTheme(): void {
		this.themeService.toggleTheme();

		if (this.switchValue) {
			this.profileService.changeTheme(1);
		} else {
			this.profileService.changeTheme(0);
		}
	}
}
