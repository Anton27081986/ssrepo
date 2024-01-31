import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@auth/services/authentication.service';
import {first} from 'rxjs';

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
    ) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: [
                '',
                [
                    Validators.required, // Добавить проверки
                ],
            ],
            password: ['', Validators.required], // Добавить проверки
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService
            .login(this.loginForm.controls.login.value, this.loginForm.controls.password.value)
            .pipe(
                first(),
            )
            .subscribe(
                _ => {
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

                    setTimeout(() => {
                        this.router.navigateByUrl(returnUrl);
                    }, 0);
                },
                (err: unknown) => {
                    this.loading = false;
                    this.error = err;
                    this.errorState = true;
                },
                () => console.log('HTTP request completed.'),
            );
    }
}
