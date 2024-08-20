import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError } from 'rxjs/operators';

@UntilDestroy()
@Component({
	selector: 'ss-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = false;

	public login = '';

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly authenticationService: AuthenticationService,
	) {
		// redirect to home if already logged in
		if (this.authenticationService.userValue) {
			this.router.navigate(['/']);
		}
	}

	public ngOnInit() {
		this.loginForm = this.formBuilder.group({
			token: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		});

		this.route.queryParams.pipe(untilDestroyed(this)).subscribe(params => {
			if (params.token) {
				this.loginForm.controls.token.setValue(params.token);
			}

			if (params.login) {
				this.login = params.login;
			}
		});
	}

	public onSubmit() {
		this.authenticationService
			.resetPassword(this.loginForm.value)
			.pipe(
				untilDestroyed(this),
				catchError((error: unknown) => {
					this.router.navigate([`auth/forgot-password?login=${this.login}`]);
					throw error;
				}),
			)
			.subscribe(() => {
				this.router.navigate(['auth/sign-in']);
			});
	}
}
