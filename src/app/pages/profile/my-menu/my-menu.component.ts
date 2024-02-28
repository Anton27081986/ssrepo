import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-my-menu',
	templateUrl: './my-menu.component.html',
	styleUrls: ['./my-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMenuComponent implements OnInit {
	public myMenuForm!: FormGroup;

	public constructor(private readonly formBuilder: FormBuilder) {}

	public ngOnInit() {
		this.myMenuForm = this.formBuilder.group({
			login: ['', [Validators.required]],
			password: ['', Validators.required],
		});
	}

	public onSubmit() {}
}
