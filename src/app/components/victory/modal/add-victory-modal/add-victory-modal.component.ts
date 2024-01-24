import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, Observable, Subject, tap, zip} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {UserService} from '@auth/services/user.service';

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

    partyWinSelectedTags: Array<{name: string; id: string}> = [{id: '0', name: 'Шубникова А.К.'}];

    tprSelectedTags: Array<{name: string; id: string}> = [{id: '0', name: 'Микро'}];

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
        private readonly _userService: UserService,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.addVictory = this.formBuilder.group({
            comment: [],
            colleague: [],
            tpr: [],
        });

        this.addVictory.valueChanges.subscribe(_ => {
            // console.log('addVictory', v);
        });

        // Подписка на изменения input поиска коллег
        zip(this.modelChangedColleague)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length > 2) {
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
                    if (value[0].length > 2) {
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

    // Модальное окно Добавить победы
    showModalAdd(): void {
        this.isVisibleAdd = true;
    }

    handleOk(): void {
        this.isVisibleAdd = false;

        const comment = this.addVictory.get('comment')?.value;
        const userList = this.userWinArray;
        const tprList = this.tprWinArray;

        this._apiService.addWins(comment, userList, tprList).pipe().subscribe();
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

    // При выборе клика
    onUserChange() {
        this.userWinArray.push(this.selectedUser); // Выбранные пользователи

        this.partyWinSelectedTags.push({
            id: '1',
            name: this.selectedUser,
        }); // добавление тега
    }

    // При выборе клика
    onTprChange() {
        this.tprWinArray.push(this.selectedTpr);

        this.tprSelectedTags.push({
            id: '1',
            name: this.selectedTpr,
        }); // добавление тега
    }

    deleteTagUser($event: any, tagsArray: object) {
        console.log('deleteTagUser $', $event.target.value);
        console.log('tagsArray $', tagsArray);
    }

    deleteTagTpr($event: any, tagsArray: object) {
        console.log('deleteTagTpr $', $event.target.value);
        console.log('tagsArray $', tagsArray);
    }
}
