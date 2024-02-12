import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserStateService} from '@app/core/states/user-state.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingsComponent implements OnInit {
    settingsForm!: FormGroup;
    value?: any;
    profileData!: any;
    profile!: Observable<any>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly userService: UserStateService,
    ) {}

    ngOnInit() {
        this.settingsForm = this.formBuilder.group({
            login: [
                '',
                [
                    Validators.required,
                    // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
            disabled: true,
        });

        this.userService
            .getProfile()
            .pipe()
            .subscribe(data => {
                this.profileData = data;
            });

        this.profile = this.userService.getProfile();
    }
}
