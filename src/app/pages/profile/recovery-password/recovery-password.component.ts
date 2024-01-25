import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-recovery-password',
    templateUrl: './recovery-password.component.html',
    styleUrls: ['./recovery-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryPasswordComponent implements OnInit {
    recoveryForm!: FormGroup;
    password: any;

    loading = false;
    submitted = false;
    error: unknown = '';

    passwordVisible = false;

    constructor(
        private readonly iconService: NzIconService,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.recoveryForm = this.formBuilder.group({
            email: ['', Validators.required],
        });
    }

    get f() {
        return this.recoveryForm.controls;
    }
}
