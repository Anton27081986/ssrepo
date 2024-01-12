import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
    myPasswordForm!: FormGroup;
    password: any;

    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error: unknown = '';

    passwordVisible = false;
    passwordVisibleRepeat = false;
    // password?: string;
    passwordRepeat?: string;

    constructor(
        private readonly iconService: NzIconService,
        private readonly formBuilder: FormBuilder,
    ) {
        this.iconService.addIconLiteral('ss:search', AppIcons.iconSearch);
    }

    ngOnInit() {
        this.myPasswordForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            passwordRepeat: ['', Validators.required],
        });
    }

    get f() {
        return this.myPasswordForm.controls;
    }

    onSubmit() {}
}
