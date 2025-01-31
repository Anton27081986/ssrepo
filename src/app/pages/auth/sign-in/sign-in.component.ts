import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { first, of, tap } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ProfileService } from '@app/pages/profile/profile.service';
import { ThemeService } from '@app/shared/theme/theme.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {PasswordComponent} from "@app/shared/components/_deprecated/password/password.component";
import {LinkComponent} from "@app/shared/components/link/link.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {CommonModule} from "@angular/common";

@UntilDestroy()
@Component({
	selector: 'ss-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	imports: [
		CommonModule,
		HeadlineComponent,
		ReactiveFormsModule,
		FormsModule,
		InputComponent,
		PasswordComponent,
		LinkComponent,
		RouterLink,
		ButtonComponent
	],
	standalone: true
})
export class SignInComponent implements OnInit {
	protected loginForm!: FormGroup<{
		password: FormControl<string | null>;
		login: FormControl<string | null>;
	}>;

	public loading = false;

	public password?: string;

	public constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly authenticationService: AuthenticationService,
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
	) {}

	public ngOnInit() {
		this.loginForm = new FormGroup({
			login: new FormControl<string>('', [Validators.required]),
			password: new FormControl<string>('', Validators.required),
		});
	}

	public onSubmit() {
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService
			.login(
				this.loginForm.controls.login.value || '',
				this.loginForm.controls.password.value || '',
			)
			.pipe(
				first(),
				switchMap(_ => {
					return this.authenticationService.authImages().pipe(
						tap(() => console.warn('authImages Ok')),
						catchError(() => {
							return of(0);
						}),
					);
				}),
				switchMap(_ => {
					return this.profileService.getTheme().pipe(
						tap(value => {
							if (value.isDarkTheme) {
								this.themeService.setDarkTheme();
							}
						}),
						catchError(() => {
							return of(0);
						}),
					);
				}),
				untilDestroyed(this),
			)
			.subscribe({
				next: () => {
					const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

					setTimeout(() => {
						this.router.navigateByUrl(returnUrl);
					}, 0);
				},
				error: (err: unknown) => {
					this.loading = false;
					console.error('HTTP Error', err);
					this.loginForm.setErrors({ unauthorized: 'Неверный логин или пароль' });
				},
			});
	}
}
