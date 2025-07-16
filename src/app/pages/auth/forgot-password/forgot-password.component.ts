import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError } from 'rxjs/operators';
import { CommonModule, NgIf } from '@angular/common';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { InputComponent } from '@app/shared/components/inputs/input/input.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@UntilDestroy()
@Component({
	selector: 'ss-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	imports: [
		CommonModule,
		NgIf,
		HeadlineComponent,
		TextComponent,
		ReactiveFormsModule,
		InputComponent,
		ButtonComponent,
		IconComponent,
		RouterLink,
	],
	standalone: true,
})
export class ForgotPasswordComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = 0;
	public submitted = false;
	public error: unknown = '';

	constructor(
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
			login: [
				null,
				[
					Validators.required,
					Validators.pattern(
						'^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
					),
				],
			],
		});

		this.route.queryParams
			.pipe(untilDestroyed(this))
			.subscribe((params) => {
				if (params.login) {
					this.loginForm.controls.login.setValue(params.login);
					this.loginForm.setErrors({
						link: 'Срок действия ссылки истек',
					});
				}
			});
	}

	private startTimer() {
		this.loading = 59;
		const timer = setInterval(() => {
			this.loading -= 1;

			if (!this.loading) {
				clearInterval(timer);
			}
		}, 1000);
	}

	public onSubmit() {
		this.authenticationService
			.resetPasswordRequest(this.loginForm.value.login)
			.pipe(
				untilDestroyed(this),
				catchError((error: unknown) => {
					this.loginForm.setErrors({
						unauthorized: 'Неверный или несуществующий e-mail',
					});
					throw error;
				}),
			)
			.subscribe(() => {
				this.submitted = true;
				this.startTimer();
			});
	}
}
