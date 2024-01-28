import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    Renderer2,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, Subject, tap, zip} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-add-victory-modal',
    templateUrl: './add-victory-modal.component.html',
    styleUrls: ['./add-victory-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVictoryModalComponent implements OnInit {
    private readonly modelChangedColleague: Subject<string> = new Subject<string>();
    private readonly modelChangedTpr: Subject<string> = new Subject<string>();

    public textPlaceHolder = 'Выберите ваших коллег из списка или введите фамилию';
    public inputValue: any = 'Alex';
    public isSended = true;
    public isVisibleAdd = true;
    public addVictory!: FormGroup;
    public submitted = false;
    public loading = false;
    public isConfirmLoading = false;
    public title!: string;

    public errorComment = false;

    public partyWinSelectedTags: Array<{name: string; id: number}> = [];
    public tprSelectedTags: Array<{name: string; id: number}> = [];
    public userWinArray: string[] = [];
    public tprWinArray: string[] = [];
    public selectedUser!: string;
    public selectedTpr!: string;

    public listColleague: Array<{name: string; id: string}> = [];
    public listTPR: Array<{name: string; id: string}> = [];

    constructor(
        private readonly _apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly chDRef: ChangeDetectorRef,
        private readonly renderer: Renderer2,
        private readonly el: ElementRef,
    ) {}

    ngOnInit() {
        this.addVictory = this.formBuilder.group({
            comment: ['', [Validators.required, Validators.maxLength(10)]],
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

    get _comment() {
        return this.addVictory.get('comment')?.value;
    }

    handleOk($event: any): void {
        $event.stopPropagation();

        console.log('this.isSended начало', this.isSended);
        this.isSended = false;

        const comment = this._comment;
        const userList = this.partyWinSelectedTags.map(item => item.id);
        const tprList = this.tprSelectedTags.map(item => item.id);

        this._apiService
            .addWins(comment, userList, tprList)
            .pipe(
                tap(_ => {
                    this.partyWinSelectedTags = [];
                    this.tprSelectedTags = [];

                    this.isSended = false;
                }),
            )
            .subscribe(
                () => {
                    console.log('this.isSended', this.isSended);
                },
                () => {
                    this.errorComment = true;
                },
            );
    }

    searchUsers($event: any) {
        this.modelChangedColleague.next($event);
    }

    searchTpr($event: any) {
        this.modelChangedTpr.next($event);
    }

    // При выборе клика по пользователю
    onUserChange() {
        console.log('onUserChange', this.selectedUser);

        this.userWinArray.push(this.selectedUser); // Выбранные пользователи
        this._apiService
            .getUserById(this.selectedUser)
            .pipe(
                tap(user => {
                    this.partyWinSelectedTags.push({
                        id: user.id,
                        name: user.name,
                    }); // добавление тега

                    this.chDRef.markForCheck();
                }),
            )
            .subscribe();
    }

    // При выборе клика по продукту
    onTprChange() {
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
        this.chDRef.markForCheck();
    }

    deleteTagTpr(i: number) {
        this.tprSelectedTags.splice(i, 1);
    }

    onOption() {
        console.log('Клик по option');
    }

    clickSelect() {
        // this.overlay = this.el.nativeElement.querySelector('.cdk-overlay-container');
        // this.renderer.addClass(this.overlay, 'hide');
    }
}
