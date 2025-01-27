import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {RouterLink} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzFormItemComponent,
		NzFormLabelComponent,
		NzFormControlComponent,
		NzInputGroupComponent,
		NzIconDirective,
		RouterLink,
		NzButtonComponent,
		NzFormDirective,
		NzInputDirective
	],
	standalone: true
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
