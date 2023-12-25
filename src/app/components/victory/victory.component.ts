import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryComponent {
    peoplelikesOpen = false;
    isVisibleAdd = false;
    isVisibleComments = false;
    isVisibleOpenOut = false;
    loginForm!: FormGroup;
    loading = false;

    checked = true;

    title: any;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
        this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
        this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
        this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
        this.iconService.addIconLiteral('ss:like', AppIcons.like);
        this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
        this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
        this.iconService.addIconLiteral('ss:medal', AppIcons.medal);
        this.iconService.addIconLiteral('ss:openOut', AppIcons.openOut);
        this.iconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
        this.iconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
        this.iconService.addIconLiteral('ss:iconClose', AppIcons.iconClose);
        this.iconService.addIconLiteral('ss:attach', AppIcons.attach);
    }

    submitted = false;
    isConfirmLoading = false;

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

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
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

    // Модальное окно раскрытой карточки
    showModalOpenOut(): void {
        this.isVisibleOpenOut = true;
    }

    handleCancelOpenOut(): void {
        this.isVisibleOpenOut = false;
    }

    handleOkOpenOut(): void {
        this.isVisibleOpenOut = false;
    }

    // Модальное окно комментариев
    showModalComments(): void {
        this.isVisibleComments = true;
    }

    handleCancelComments(): void {
        this.isVisibleComments = false;
    }

    handleOkComments(): void {
        this.isVisibleComments = false;
    }

    search() {}
}
