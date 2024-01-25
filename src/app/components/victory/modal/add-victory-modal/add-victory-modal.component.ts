import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, Observable, Subject, tap, zip} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-add-victory-modal',
    templateUrl: './add-victory-modal.component.html',
    styleUrls: ['./add-victory-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVictoryModalComponent implements OnInit {
    isVisibleAdd = true;
    addVictory!: FormGroup;
    submitted = false;
    loading = false;
    isConfirmLoading = false;
    title: any;

    joinWin = [
        {label: 'Совместная победа', value: 'Совместная победа', disabled: true, checked: true},
    ];

    public joinWinLabel = false;

    partyWinSelectedTags: Array<{name: string; id: number}> = [];

    tprSelectedTags: Array<{name: string; id: number}> = [];

    public userWinArray: string[] = [];
    public tprWinArray: string[] = [];

    backendErrors$!: Observable<any>;

    private readonly modelChangedColleague: Subject<string> = new Subject<string>();
    private readonly modelChangedTpr: Subject<string> = new Subject<string>();

    selectedUser!: string;
    selectedTpr!: string;

    listColleague: Array<{name: string; id: string}> = [];
    listTPR: Array<{name: string; id: string}> = [];

    constructor(
        private readonly _apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly chDRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.addVictory = this.formBuilder.group({
            comment: ['', [Validators.required]],
            colleague: [''],
            tpr: [''],
        });

        this.addVictory.valueChanges.subscribe(_ => {
            // console.log('addVictory', v);
        });

        // Подписка на изменения input поиска коллег
        zip(this.modelChangedColleague)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length > 1) {
                        this._apiService
                            .getUsersByFIO(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listColleague = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();

        // Подписка на изменения input поиска tpr
        zip(this.modelChangedTpr)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length > 1) {
                        this._apiService
                            .searchProductByName(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listTPR = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();
    }

    handleOk(): void {
        this.isVisibleAdd = false;

        const comment = this.addVictory.get('comment')?.value;
        const userList = this.partyWinSelectedTags.map(item => item.id);
        const tprList = this.tprSelectedTags.map(item => item.id);

        this._apiService
            .addWins(comment, userList, tprList)
            .pipe(
                tap(_ => {
                    this.partyWinSelectedTags = [];
                    this.tprSelectedTags = [];
                }),
            )
            .subscribe();

        // Валидация
        if (this.addVictory.valid) {
            console.log('submit', this.addVictory.value);
        } else {
            console.log('submit invalid', this.addVictory.value);

            Object.values(this.addVictory.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
        }
    }

    handleCancel(): void {
        this.isVisibleAdd = false;
    }

    searchUsers($event: any) {
        this.modelChangedColleague.next($event);
    }

    searchTpr($event: any) {
        this.modelChangedTpr.next($event);
    }

    // При выборе клика по пользователю
    onUserChange() {
        console.log('onUserChange');

        this.userWinArray.push(this.selectedUser); // Выбранные пользователи
        this._apiService
            .getUserById(this.selectedUser)
            .pipe(
                tap(user => {
                    this.partyWinSelectedTags.push({
                        id: user.id,
                        name: user.name,
                    }); // добавление тега

                    if (this.partyWinSelectedTags.length === 2) {
                        this.joinWinLabel = true;
                    }

                    this.chDRef.markForCheck();
                }),
            )
            .subscribe();
    }

    // При выборе клика по продукту
    onTprChange() {
        console.log('onTprChange');

        this.tprWinArray.push(this.selectedTpr);
        this._apiService
            .getProductById(Number(this.selectedTpr))
            .pipe(
                tap(user => {
                    this.tprSelectedTags.push({
                        id: user.id,
                        name: user.name,
                    }); // добавление тега

                    this.chDRef.markForCheck();
                }),
            )
            .subscribe();
    }

    deleteTagUser(i: number) {
        this.partyWinSelectedTags.splice(i, 1);

        if (this.partyWinSelectedTags.length < 2) {
            this.joinWinLabel = false;
        }

        this.chDRef.markForCheck();
    }

    deleteTagTpr(i: number) {
        this.tprSelectedTags.splice(i, 1);
    }
}
