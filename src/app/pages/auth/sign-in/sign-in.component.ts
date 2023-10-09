import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
    loginForm!: FormGroup;

    submitForm(): void {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[i].markAsDirty();
            this.loginForm.controls[i].updateValueAndValidity();
        }
    }

    constructor(private readonly fb: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
        });
    }
}
