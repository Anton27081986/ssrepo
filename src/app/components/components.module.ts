import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SearchComponent} from './search/search.component';
import {ResultItemComponent} from './search/result-item/result-item.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {MobileMenuComponent} from './mobile-menu/mobile-menu.component';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {ProfilePopupComponent} from './profile-popup/profile-popup.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {AuctionSalesComponent} from './auction-sales/auction-sales.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NotificationComponent} from './notification/notification.component';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NgScrollbar} from 'ngx-scrollbar';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {ThankyouComponent} from './thankyou/thankyou.component';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {ThankColleagueComponent} from './thank-colleague/thank-colleague.component';
import {MaxLengthTextPipe} from '@app/shared/pipe/max-length-text.pipe';
import {UpFirstPipe} from '@app/shared/pipe/up-first.pipe';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {VictoryComponent} from './victory/victory.component';
import {BirthdayComponent} from './birthday/birthday.component';
import {RatingComponent} from './rating/rating.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {CurrencyComponent} from './currency/currency.component';
import {AdressBookComponent} from './adress-book/adress-book.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {AddVictoryModalComponent} from './victory/modal/add-victory-modal/add-victory-modal.component';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';
import {PeopleLikeModalComponent} from './victory/modal/people-like-modal/people-like-modal.component';
import {PartyVictoryComponent} from './victory/modal/party-victory/party-victory.component';
import {TooltipDirective} from './victory/tooltip.directive';

@NgModule({
    declarations: [
        SearchComponent,
        ResultItemComponent,
        MainMenuComponent,
        MobileMenuComponent,
        ProfilePopupComponent,
        AuctionSalesComponent,
        NotificationComponent,
        ThankyouComponent,
        ThankColleagueComponent,
        VictoryComponent,
        BirthdayComponent,
        RatingComponent,
        CurrencyComponent,
        AdressBookComponent,
        ModalInfoComponent,
        AddVictoryModalComponent,
        CommentsModalComponent,
        PeopleLikeModalComponent,
        PartyVictoryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        RouterLink,
        NzIconModule,
        NzMenuModule,
        NzTabsModule,
        NzButtonModule,
        NgOptimizedImage,
        NzTableModule,
        NzDividerModule,
        NzDropDownModule,
        NgScrollbar,
        NzListModule,
        NzAvatarModule,
        NzDatePickerModule,
        MaxLengthTextPipe,
        UpFirstPipe,
        NzPaginationModule,
        NzModalModule,
        NzSelectModule,
        NzCheckboxModule,
        NzCarouselModule,
        NzCardModule,
        TooltipDirective,
    ],
    exports: [
        SearchComponent,
        MainMenuComponent,
        MobileMenuComponent,
        ProfilePopupComponent,
        AuctionSalesComponent,
        NotificationComponent,
        ThankyouComponent,
        ThankColleagueComponent,
        BirthdayComponent,
        VictoryComponent,
        RatingComponent,
        CurrencyComponent,
        AdressBookComponent,
    ],
})
export class ComponentsModule {}
