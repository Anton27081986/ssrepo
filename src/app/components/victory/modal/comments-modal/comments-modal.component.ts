import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import {NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {CommonModule, DatePipe, NgClass, NgIf} from "@angular/common";
import {NzAutosizeDirective, NzInputDirective} from "ng-zorro-antd/input";

@Component({
	selector: 'app-comments-modal',
	templateUrl: './comments-modal.component.html',
	styleUrls: ['./comments-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NzFormDirective,
		ReactiveFormsModule,
		NzIconDirective,
		NgClass,
		DatePipe,
		NgIf,
		NzFormItemComponent,
		NzInputDirective,
		NzAutosizeDirective
	],
	standalone: true
})
export class CommentsModalComponent implements OnInit {
	readonly nzModalData: any = inject(NZ_MODAL_DATA);
	userData!: Observable<any>;

	loginForm!: FormGroup;
	submitted = false;
	loading = false;
	isConfirmLoading = false;

	peoplelikesOpen = false;
	// attachIsVisible = false;
	commentVisible = false;
	attachVisible = false;

	constructor(
		private readonly modal: NzModalRef,
		private readonly formBuilder: FormBuilder,
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			login: [
				'',
				[
					Validators.required,
					// Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
				],
			],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
	}

	search() {}
}
