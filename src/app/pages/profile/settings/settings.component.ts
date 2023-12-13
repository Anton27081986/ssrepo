import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
    settingsForm!: FormGroup;
    value?: any;

    constructor(private readonly formBuilder: FormBuilder) {}

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
    }

    onSubmit() {}
}
