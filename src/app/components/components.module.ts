import { NgModule } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgScrollbar } from 'ngx-scrollbar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { MaxLengthTextPipe } from '@app/shared/pipe/max-length-text.pipe';
import { UpFirstPipe } from '@app/shared/pipe/up-first.pipe';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { AddressBookComponent } from '@app/components/address-book/address-book.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { CommentsModalComponent } from '@app/components/modal/comments-modal/comments-modal.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PeopleLikedDirective } from '@app/components/victory/people-liked.directive';
import { SuperLikeDirective } from '@app/components/victory/super-like.directive';
import { BackendErrorMessagesComponent } from '@app/shared/modules/backend-error-messages/backend-error-messages.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { CardVictoryComponent } from '@app/components/victory/card-victory/card-victory.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DateTimePipe } from '@app/shared/pipe/date-time.pipe';
import { RatingComponent } from '@app/components/rating/rating.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalTransportNoticeComponent } from '@app/components/modal/modal-transport-notice/modal-transport-notice.component';
import { TransportModule } from '@app/components/transport/transport.module';
import { ThanksPartnerComponent } from '@app/components/thank-partner/thanks-partner.component';
import { TransportComponent } from '@app/components/transport/transport.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { ModalModule } from '@app/components/modal/modal.module';
import { SuperLikeComponent } from './victory/super-like/super-like.component';
import { LikeComponent } from './like/like.component';
import { ModalInfoUserComponent } from './modal/modal-info-user/modal-info-user.component';
import { TooltipDirective } from './victory/tooltip.directive';
import { AddVictoryModalComponent } from './victory/modal/add-victory-modal/add-victory-modal.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { VictoryComponent } from './victory/victory.component';
import { ThanksColleagueComponent } from './thank-colleague/thanks-colleague.component';
import { NotificationComponent } from './notification/notification.component';
import { AuctionSalesComponent } from './auction-sales/auction-sales.component';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AllSearchComponent } from './all-search/all-search.component';
import { ResultItemComponent } from './all-search/result-item/result-item.component';
import { SearchWithAuthComponent } from './profile-popup/search-with-auth/search-with-auth.component';
import { ResultSearchWithAuthComponent } from './profile-popup/search-with-auth/result-search-with-auth/result-search-with-auth.component';

@NgModule({
	declarations: [
		ResultItemComponent,
		MainMenuComponent,
		MobileMenuComponent,
		ProfilePopupComponent,
		AuctionSalesComponent,
		NotificationComponent,
		ThanksPartnerComponent,
		ThanksColleagueComponent,
		VictoryComponent,
		BirthdayComponent,
		RatingComponent,
		AddressBookComponent,
		ModalInfoComponent,
		AddVictoryModalComponent,
		CommentsModalComponent,
		ModalInfoUserComponent,
		LikeComponent,
		SuperLikeComponent,
		BackendErrorMessagesComponent,
		LoaderComponent,
		LoaderComponent,
		PaginationComponent,
		LoaderComponent,
		CardVictoryComponent,
		CarouselComponent,
		ModalTransportNoticeComponent,
		AllSearchComponent,
		SearchWithAuthComponent,
		ResultSearchWithAuthComponent,
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
		NzToolTipModule,
		PeopleLikedDirective,
		SuperLikeDirective,
		NzSpinModule,
		NzTypographyModule,
		DateTimePipe,
		CarouselModule,
		TransportModule,
		TableModule,
		ButtonModule,
		HeadlineModule,
		CardModule,
		CaptionModule,
		ModalModule,
	],
	exports: [
		MainMenuComponent,
		MobileMenuComponent,
		ProfilePopupComponent,
		AuctionSalesComponent,
		NotificationComponent,
		ThanksPartnerComponent,
		ThanksColleagueComponent,
		BirthdayComponent,
		VictoryComponent,
		RatingComponent,
		AddressBookComponent,
		TransportComponent,
		AllSearchComponent,
		LoaderComponent
	]
})
export class ComponentsModule {}
