import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-victory-modal',
    templateUrl: './add-victory-modal.component.html',
    styleUrls: ['./add-victory-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVictoryModalComponent {
    isVisibleAdd = true;
    loginForm!: FormGroup;
    submitted = false;
    loading = false;
    isConfirmLoading = false;
    title: any;
    joinWin = [
        {label: 'Совместная победа', value: 'Совместная победа', disabled: true, checked: true},
    ];
    // attachIsVisible = false;

    constructor(private readonly formBuilder: FormBuilder) {}

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

    // Модальное окно Добавить победы
    showModalAdd(): void {
        this.isVisibleAdd = true;
    }

    handleOk(): void {
        this.isVisibleAdd = false;
    }

    handleCancel(): void {
        this.isVisibleAdd = false;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
    }

    search() {}
}
