import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = false;
	public submitted = false;
	public error: unknown = '';

	public password?: string;

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly router: Router,
		private readonly authenticationService: AuthenticationService, // fake
	) {
		// redirect to home if already logged in
		if (this.authenticationService.userValue) {
			this.router.navigate(['/']);
		}
	}

	public ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: [
				null,
				[
					Validators.required,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
				],
			],
		});
	}

	// convenience getter for easy access to form fields
	public get f() {
		return this.loginForm.controls;
	}
}
