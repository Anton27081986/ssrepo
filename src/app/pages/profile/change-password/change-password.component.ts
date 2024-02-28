import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
	public myPasswordForm!: FormGroup;
	public password: any;

	public loading = false;
	public submitted = false;
	public error: unknown = '';

	public passwordVisible = false;
	public passwordVisibleRepeat = false;
	public passwordRepeat?: string;

	public constructor(private readonly formBuilder: FormBuilder) {}

	public ngOnInit() {
		this.myPasswordForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			passwordRepeat: ['', Validators.required],
		});
	}

	public get f() {
		return this.myPasswordForm.controls;
	}
}
