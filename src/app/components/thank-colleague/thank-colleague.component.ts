import {ChangeDetectionStrategy, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, Observable, Subject, tap, zip} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-thank-colleague',
    templateUrl: './thank-colleague.component.html',
    styleUrls: ['./thank-colleague.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankColleagueComponent implements OnInit {
    public date: any;
    public isModalVisible = false;
    public thankColleagueForm!: FormGroup;
    public loading = false;
    public submitted = false;
    public isConfirmLoading = false;
    public thankColleagueList!: Observable<any>;
    public pageSize = 6;
    public pageIndex = 1;

    private readonly modelChanged: Subject<string> = new Subject<string>();

    // Переменные для поиска
    public selectedValue = null;
    public listOfOption: Array<{name: string; id: string}> = [];

    public nzFilterOption = (): boolean => true;

    public constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        public modalCreateService: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
    ) {}

    public ngOnInit() {
        zip(this.modelChanged)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length >= 3) {
                        this.apiService
                            .getUsersByFIO(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listOfOption = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();

        this.loadAllThanksForColleagues();

        this.thankColleagueForm = this.formBuilder.group({
            name: [''],
            comment: [''],
        });
    }

    public loadAllThanksForColleagues() {
        this.thankColleagueList = this.apiService
            .getThanksColleagueList()
            .pipe(map(({items}) => items));
    }

    // TODO: перенести валидацию
    public createThanksForColleague() {
        // eslint-disable-next-line no-debugger
        debugger;
        console.log(this.thankColleagueForm);
        this.submitted = true;

        if (this.thankColleagueForm.invalid) {
            return;
        }

        this.loading = true;
    }

    public deleteThanksForColleague(thanksId: number): void {
        // eslint-disable-next-line no-debugger
        debugger;
        console.log(thanksId);
        this.apiService.deleteThanksColleague(thanksId).subscribe({
            next: response => {
                console.log('Спасибо добавлен', response);
                this.loadAllThanksForColleagues();
            },
            error: (error: unknown) => console.error('Ошибка при добавлении спасибо', error),
        });
    }

    // Модальное окно комментариев
    public showCommentsModal(item: any): void {
        // eslint-disable-next-line no-debugger
        debugger;
        this.modalCreateService
            .create({
                nzClosable: false,
                nzFooter: null,
                nzTitle: 'Спасибо коллеге',
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: CommentsModalComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                },
            })
            .afterClose.subscribe();
    }

    public showModal(): void {
        this.isModalVisible = true;
    }

    public handleOk(): void {
        // eslint-disable-next-line no-debugger
        debugger;
        console.log(this.thankColleagueForm);

        if (this.thankColleagueForm.valid) {
            const toUserId = this.thankColleagueForm.value.name;
            const note = this.thankColleagueForm.value.comment;

            this.apiService.addThanksColleague(toUserId, note).subscribe({
                next: response => console.log('Спасибо добавлен', response),
                error: (error: unknown) => console.error('Ошибка при добавлении спасибо', error),
            });
        } else {
            console.log('');
        }

        this.isModalVisible = false;
    }

    public handleCancel(): void {
        this.isModalVisible = false;
    }

    public search($event: any) {
        this.modelChanged.next($event);
    }
}
