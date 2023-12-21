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
    ],
})
export class ComponentsModule {}
