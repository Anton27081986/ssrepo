import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/core/states/authentication.service';
import { first, of, tap } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ProfileService } from '@app/pages/profile/profile.service';
import { ThemeService } from '@app/shared/theme/theme.service';
import { UserStateService } from '@app/core/states/user-state.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class SignInComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = false;
	public submitted = false;
	public error: unknown = '';
	public errorState = false;

	public passwordVisible = false;
	public password?: string;

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly authenticationService: AuthenticationService,
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
		private readonly userStateService: UserStateService,
	) {}

	public ngOnInit() {
		this.loginForm = this.formBuilder.group({
			login: [
				'',
				[
					Validators.required, // Добавить проверки
				],
			],
			password: ['', Validators.required], // Добавить проверки
		});
	}

	public onSubmit() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService
			.login(this.loginForm.controls.login.value, this.loginForm.controls.password.value)
			.pipe(
				first(),
				switchMap(_ => {
					return this.userStateService.loadUserProfile().pipe(
						tap(() => console.log('user profile loaded')),
						catchError(() => {
							return of(0);
						}),
					);
				}),
				switchMap(_ => {
					return this.authenticationService.authImages().pipe(
						tap(_ => console.log('authImages Ok')),
						catchError((_: unknown) => {
							return of(0);
						}),
					);
				}),
				switchMap(_ => {
					return this.profileService.getTheme().pipe(
						tap(value => {
							if (value.isDarkTheme) {
								this.themeService.setDarkTheme().then();
							}
						}),
						catchError((_: unknown) => {
							return of(0);
						}),
					);
				}),
			)
			.subscribe(
				_ => {
					const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

					setTimeout(() => {
						this.router.navigateByUrl(returnUrl);
					}, 0);
				},
				(err: unknown) => {
					this.loading = false;
					console.log('HTTP Error', err);
					this.error = err;
					this.errorState = true;
				},
				() => console.log('HTTP request completed.'),
			);
	}
}
