import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-recovery-password',
	templateUrl: './recovery-password.component.html',
	styleUrls: ['./recovery-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NzIconDirective,
		NzFormItemComponent,
		NzFormLabelComponent,
		NzFormControlComponent,
		NzInputGroupComponent,
		ReactiveFormsModule,
		NzFormDirective,
		NzInputDirective,
		NzButtonComponent
	],
	standalone: true
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
