import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@auth/services/authentication.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error: unknown = '';

    passwordVisible = false;
    password?: string;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService, // fake
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: [
                'test@mail.com',
                [
                    Validators.required,
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.authenticationService
            .loginBasic('nekrasov_va', 'jN*Bgf9.*f#&FBr', 'https://erp-dev.ssnab.it/')
            .pipe()
            .subscribe(
                (data: any) => {
                    if (data) {
                        console.log('data', data);
                    }
                },
                (err: unknown) => console.log('HTTP Error', err),
                () => console.log('HTTP request completed.'),
            );

        this.submitted = true;

        // stop here if form is invalid
        // if (this.loginForm.invalid) {
        //     return;
        // }

        this.loading = true;
        // this.authenticationService
        //     .login(this.f.login.value, this.f.password.value)
        //     .pipe(first())
        //     .subscribe({
        //         next: () => {
        //             // get return url from query parameters or default to home page
        //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //             const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        //
        //             this.router.navigateByUrl(returnUrl);
        //         },
        //         error: (error: unknown) => {
        //             this.error = error;
        //             this.loading = false;
        //         },
        //     });
    }
}
