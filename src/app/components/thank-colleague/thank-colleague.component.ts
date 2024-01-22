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
    date: any;
    isVisible = false;
    thankColleague!: FormGroup;
    loading = false;
    submitted = false;
    isConfirmLoading = false;

    public thankColleagueList!: Observable<any>;

    pageSize = 6;
    pageIndex = 1;

    private readonly modelChanged: Subject<string> = new Subject<string>();

    // Переменные для поиска
    selectedValue = null;
    listOfOption: Array<{name: string; id: string}> = [];

    nzFilterOption = (): boolean => true;

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
    ) {}

    ngOnInit() {
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

        this.thankColleagueList = this.apiService
            .getThanksColleague()
            .pipe(map(({items}) => items));

        this.thankColleague = this.formBuilder.group({
            name: [''],
            comment: [''],
        });
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        console.log('onSubmit')
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    search($event: any) {
        this.modelChanged.next($event);
    }

    // При выборе клика
    onUserChange() {}

    // Модальное окно комментариев
    showModalComments(item: any): void {
        console.log('спасибо коллеге', item);

        this.modalCreate
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

    onSubmit() {
        console.log('onSubmit', this.thankColleague)

        this.submitted = true;

        // stop here if form is invalid
        if (this.thankColleague.invalid) {
            return;
        }

        this.loading = true;
    }

    // destroyModal(): void {
    //     this.modal.destroy();
    // }
}
