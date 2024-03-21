import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-recovery-password',
	templateUrl: './recovery-password.component.html',
	styleUrls: ['./recovery-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryPasswordComponent implements OnInit {
	public recoveryForm!: FormGroup;
	public password: any;

	public loading = false;
	public error: unknown = '';

	public passwordVisible = false;

	public constructor(private readonly formBuilder: FormBuilder) {}

	public ngOnInit() {
		this.recoveryForm = this.formBuilder.group({
			email: ['', Validators.required],
		});
	}

	public get f() {
		return this.recoveryForm.controls;
	}
}
