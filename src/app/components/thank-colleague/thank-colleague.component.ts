import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, Observable, Subject, tap, zip} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';

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
    public offset = 0;
    public currentUserId: any;
    public getExtendedMode!: Observable<any>;

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
        private readonly cdr: ChangeDetectorRef,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:delete', AppIcons.delete);
    }

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

        this.apiService.getProfile().subscribe(profile => {
            this.currentUserId = profile.id;
        });

        this.loadAllThanksForColleagues();

        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(map(({isExtendedMode}) => isExtendedMode))
            .subscribe(value => {
                this.getExtendedMode = value;
            });

        this.thankColleagueForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            comment: ['', [Validators.required]],
        });
    }

    public get name() {
        return this.thankColleagueForm.get('name');
    }

    public get comment() {
        return this.thankColleagueForm.get('comment');
    }

    public loadAllThanksForColleagues() {
        this.thankColleagueList = this.apiService
            .getThanksColleagueList()
            .pipe(map(({items}) => items));
    }

    // TODO: перенести валидацию
    public createThanksForColleague() {
        console.log(this.thankColleagueForm);
        this.submitted = true;

        if (this.thankColleagueForm.invalid) {
            return;
        }

        this.loading = true;
    }

    public deleteThanksForColleague(thanks: any): void {
        console.log(thanks.id);
        this.apiService.deleteThanksColleague(thanks.id).subscribe({
            next: response => {
                console.log('Спасибо удалён', response);
                this.loadAllThanksForColleagues();
                this.cdr.detectChanges();
            },
            error: (error: unknown) => console.error('Ошибка при удалении спасибо', error),
        });
    }

    // Модальное окно комментариев
    public showModalComments(item: any, type: number): void {
        this.modalCreateService
            .create({
                nzClosable: true,
                nzFooter: null,
                nzTitle: `Благодарность № ${item.id}`,
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: CommentsModalComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                    type,
                },
            })
            .afterClose.subscribe(() => {
                this.loadAllThanksForColleagues();
            });
    }

    public showModal(): void {
        this.isModalVisible = true;
    }

    public handleOk(): void {
        if (this.thankColleagueForm.valid) {
            const toUserId = this.thankColleagueForm.value.name;
            const note = this.thankColleagueForm.value.comment;

            this.apiService.addThanksColleague(toUserId, note).subscribe({
                next: _ => {
                    this.loadAllThanksForColleagues();
                },
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
