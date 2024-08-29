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
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BackendErrorMessagesComponent } from '@app/shared/modules/backend-error-messages/backend-error-messages.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
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
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { SsMenuModule } from '@app/shared/components/ss-menu/ss-menu.module';
import { AddVictoryModalComponent } from './victory/modal/add-victory-modal/add-victory-modal.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { ThanksColleagueComponent } from './thank-colleague/thanks-colleague.component';
import { NotificationComponent } from './notification/notification.component';
import { AuctionSalesComponent } from './auction-sales/auction-sales.component';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProfileCardComponent } from '@app/components/profile-card/profile-card.component';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { UserCardComponent } from '@app/components/user-card/user-card.component';
import { UserCardWidgetComponent } from '@app/components/user-card-widget/user-card-widget.component';
import { VictoryModalComponent } from '@app/components/victory/modal/victory-modal/victory-modal.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { ChipsUserSearchModule } from '@app/shared/components/inputs/chips-user-search/chips-user-search.module';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { LikeComponent } from '@app/components/like/like.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { UserListMoreComponent } from '@app/components/user-list-more/user-list-more.component';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { AddVictoryModalResultComponent } from '@app/components/victory/modal/add-victory-modal-result/add-victory-modal-result.component';
import { VictoryCommentComponent } from '@app/components/victory/victory-comment/victory-comment.component';
import { ChoiceLikeComponent } from '@app/components/choice-like/choice-like.component';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { ThanksPartnerCardComponent } from '@app/components/thank-partner/thanks-partner-card/thanks-parther-card.component';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';

@NgModule({
	declarations: [
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
		AddVictoryModalComponent,
		BackendErrorMessagesComponent,
		PaginationComponent,
		CarouselComponent,
		ModalTransportNoticeComponent,
		ProfileCardComponent,
		UserCardComponent,
		UserCardWidgetComponent,
		VictoryModalComponent,
		UserInfoPopupComponent,
		LikeComponent,
		UserListMoreComponent,
		AddVictoryModalResultComponent,
		VictoryCommentComponent,
		ChoiceLikeComponent,
		ThanksPartnerCardComponent,
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
		NzToolTipModule,
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
		IconModule,
		LoaderModule,
		TextModule,
		AvatarModule,
		InputModule,
		SearchInputModule,
		EmptyDataPageModule,
		EmptyPlaceholderModule,
		SsMenuModule,
		SsDividerModule,
		TextareaModule,
		ChipsUserSearchModule,
		TooltipModule,
		ChipsSearchModule,
		DatepickerInputModule,
		AttachmentModule,
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
		PaginationComponent,
		ProfileCardComponent,
		UserCardComponent,
		UserCardWidgetComponent,
		VictoryModalComponent,
		UserInfoPopupComponent,
		LikeComponent,
		UserListMoreComponent,
		AddVictoryModalResultComponent,
		VictoryCommentComponent,
		ChoiceLikeComponent,
		ThanksPartnerCardComponent,
	],
})
export class ComponentsModule {}
