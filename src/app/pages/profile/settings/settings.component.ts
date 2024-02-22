import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
	public settingsForm!: FormGroup;
	public userProfile$!: Observable<IUserProfile | null>;

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly userStateService: UserProfileStoreService,
	) {}

	public ngOnInit() {
		this.settingsForm = this.formBuilder.group({
			login: ['', [Validators.required]],
			password: ['', Validators.required],
			disabled: true,
		});

		this.userProfile$ = this.userStateService.userProfile$;
	}
}
