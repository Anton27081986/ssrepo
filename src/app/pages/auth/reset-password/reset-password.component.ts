import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = false;
	public error: unknown = '';

	public passwordVisible = false;
	public passwordVisibleRepeat = false;
	public password?: string;
	public passwordRepeat?: string;

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
			username: ['', Validators.required],
			password: ['', Validators.required],
			passwordRepeat: ['', Validators.required],
		});
	}
}
