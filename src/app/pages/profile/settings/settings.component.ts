import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { Observable } from 'rxjs';
import {
	AsyncPipe,
	CommonModule,
	DatePipe,
	NgOptimizedImage,
} from '@angular/common';
import {
	ButtonComponent,
	ButtonType,
	IconComponent,
	IconType,
} from '@front-components/components';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		AsyncPipe,
		DatePipe,
		ButtonComponent,
		IconComponent,
		NgOptimizedImage,
	],
	standalone: true,
})
export class SettingsComponent implements OnInit {
	public settingsForm!: FormGroup;
	public userProfile$!: Observable<IUserProfile | null>;

	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly userStateService: UserProfileStoreService
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
