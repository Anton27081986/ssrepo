import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@auth/services/authentication.service';
import {first} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SignInComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error: unknown = '';
    errorState = false;

    passwordVisible = false;
    password?: string;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService,
        private readonly message: NzMessageService,
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

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    createMessage(type: string): void {
        this.message.create(type, `This is a message of ${type}`);
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService
            .login(this.loginForm.controls.login.value, this.loginForm.controls.password.value)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    // get return url from query parameters or default to home page

                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

                    this.router.navigateByUrl(returnUrl);

                    if (data) {
                        // console.log('data', data);
                    }
                },
                (err: unknown) => {
                    this.loading = false;
                    console.log('HTTP Error', err);
                    this.error = err;
                    this.errorState = true;
                    // this.stateDescription = err.message; // настроить текст ошибки
                    // this.createMessage('error'); // всплывающее окно с ошибкой
                },
                () => console.log('HTTP request completed.'),
            );
    }
}
