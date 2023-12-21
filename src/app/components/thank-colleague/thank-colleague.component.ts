import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
    selector: 'app-thank-colleague',
    templateUrl: './thank-colleague.component.html',
    styleUrls: ['./thank-colleague.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankColleagueComponent {
    date: any;
    isVisible = false;
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    isConfirmLoading = false;

    constructor(
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

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
    }

    // destroyModal(): void {
    //     this.modal.destroy();
    // }
}
