import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@auth/services/authentication.service';
import {first, tap} from 'rxjs';

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
                    Validators.required,
                    // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
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
                // switchMap(value => {
                //     return this.authenticationService.authImages()
                // })
            )
            .subscribe(
                value => {
                    console.log('value authImages', value);

                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

                    this.router.navigateByUrl(returnUrl);
                },
                (err: unknown) => {
                    this.loading = false;
                    console.log('HTTP Error', err);
                    this.error = err;
                    this.errorState = true;
                },
                () => console.log('HTTP request completed.'),
            );

        this.authenticationService
            .authImages()
            .pipe(
                tap(value => {
                    console.log('authImages', value);
                }),
            )
            .subscribe();
    }
}
