import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { first, of, tap } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ProfileService } from '@app/pages/profile/profile.service';
import { ThemeService } from '@app/shared/theme/theme.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class SignInComponent implements OnInit {
	protected loginForm!: FormGroup<{ password: FormControl<string | null>; login: FormControl<string | null> }>;

	public loading = false;

	public passwordVisible = false;
	public password?: string;

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly authenticationService: AuthenticationService,
		private readonly profileService: ProfileService,
		private readonly themeService: ThemeService,
	) {}

	public ngOnInit() {
		this.loginForm = new FormGroup({
			login: new FormControl<string>('', [
				Validators.required, // Добавить проверки
			]),
			password: new FormControl<string>('', Validators.required), // Добавить проверки
		});
	}

	getControl(name:string) {
		return this.loginForm.get(name) as FormControl;
	}

	public onSubmit() {
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService
			.login(this.loginForm.controls.login.value || '', this.loginForm.controls.password.value || '')
			.pipe(
				first(),
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
					this.loginForm.setErrors({ unauthorized: 'Неверный логин или пароль' });
				},
				() => console.log('HTTP request completed.'),
			);
	}
}
