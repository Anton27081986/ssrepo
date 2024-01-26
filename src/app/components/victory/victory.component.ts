import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/shared/services/api/api.service';
import {map, Observable, tap} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AddVictoryModalComponent} from '@app/components/victory/modal/add-victory-modal/add-victory-modal.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryComponent implements OnInit, DoCheck {
    @ViewChild('liked') likedPeople!: ElementRef;

    private localData: any;
    total!: number;
    pageSize = 6;
    pageIndex = 1;
    offset = 0;
    getExtendedMode!: Observable<any>;

    victoryForm!: FormGroup;
    winsList!: Observable<any>;
    winsUrl!: Observable<any>;
    winsGroupsList!: Observable<any>;

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly chDRef: ChangeDetectorRef,
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
        this.iconService.addIconLiteral('ss:goldLike', AppIcons.goldLike);
        this.iconService.addIconLiteral('ss:silverLike', AppIcons.silverLike);
        this.iconService.addIconLiteral('ss:bronzeLike', AppIcons.bronzeLike);
    }

    ngDoCheck() {
        if (this.localData.name !== this.winsList) {
            // console.log('Разные')
            // this.chDRef.markForCheck();
        }
    }

    ngOnInit() {
        this.winsList = this.apiService.getWins(this.pageSize, this.offset);
        this.localData = this.winsList;

        // Опитимизировать два запросы
        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(map(({isExtendedMode}) => isExtendedMode))
            .subscribe(value => {
                this.getExtendedMode = value;
            });

        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(
                untilDestroyed(this),
                map(({total}) => total),
                tap(value => {
                    this.total = value;
                }),
            )
            .subscribe();

        this.winsUrl = this.apiService.getWins(this.pageSize, this.offset);
        this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({items}) => items));
        this.victoryForm = this.formBuilder.group({
            search: ['', [Validators.required]],
            password: ['', Validators.required],
        });
    }

    // Модальное окно добавления победы
    showModaAddWin(): void {
        this.modalCreate
            .create({
                nzClosable: true,
                nzFooter: null,
                nzTitle: 'Делитесь вашими победами, ведь успех заразителен!',
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: AddVictoryModalComponent,
                nzViewContainerRef: this.viewContainerRef,
            })
            .afterClose.subscribe();
    }

    nzPageIndexChange($event: number) {
        if ($event === 1) {
            this.offset = 0;
        } else {
            this.offset = this.pageSize * $event - this.pageSize;
        }

        this.pageIndex = $event; // Установка текущего индекса

        this.winsList = this.apiService.getWins(this.pageSize, this.offset).pipe();
        this.chDRef.markForCheck();
    }
}
