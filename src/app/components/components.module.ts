import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgScrollbar } from 'ngx-scrollbar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { MaxLengthTextPipe } from '@app/shared/pipe/max-length-text.pipe';
import { UpFirstPipe } from '@app/shared/pipe/up-first.pipe';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BackendErrorMessagesComponent } from '@app/shared/modules/backend-error-messages/backend-error-messages.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { DateTimePipe } from '@app/shared/pipe/date-time.pipe';
import { RatingComponent } from '@app/components/rating/rating.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ModalTransportNoticeComponent } from '@app/components/modal/modal-transport-notice/modal-transport-notice.component';
import { ThanksPartnerComponent } from '@app/components/thank-partner/thanks-partner.component';
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
import { ProfileCardComponent } from '@app/components/profile-card/profile-card.component';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { UserCardComponent } from '@app/components/user-card/user-card.component';
import { UserCardWidgetComponent } from '@app/components/user-card-widget/user-card-widget.component';
import { VictoryModalComponent } from '@app/components/victory/modal/victory-modal/victory-modal.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { ChipsUserSearchModule } from '@app/shared/components/inputs/chips-user-search/chips-user-search.module';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { LikeComponent } from '@app/shared/components/like/like.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { AddVictoryModalResultComponent } from '@app/components/victory/modal/add-victory-modal-result/add-victory-modal-result.component';
import { VictoryCommentComponent } from '@app/components/victory/victory-comment/victory-comment.component';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { ThanksPartnerCardComponent } from '@app/components/thank-partner/thanks-partner-card/thanks-parther-card.component';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';
import { FormControlInputWithFuncEditModule } from '@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.module';
import { LikeModule } from '@app/shared/components/like/like.module';
import { CarouselComponent } from './carousel/carousel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { AuctionSalesComponent } from './auction-sales/auction-sales.component';
import { NotificationComponent } from './notification/notification.component';
import { AddVictoryModalComponent } from './victory/modal/add-victory-modal/add-victory-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ChoiceLikeModule } from '@app/shared/components/choice-like/choice-like.module';
import { RatingTeamTabComponent } from '@app/components/rating/rating-team-tab/rating-team-tab.component';
import { SelectModule } from '@app/shared/components/select/select.module';
import { SearchClientInputModule } from '@app/shared/components/inputs/search-client-input/search-client-input.module';
import { SearchUserInputModule } from '@app/shared/components/inputs/search-user-input/search-user-input.module';
import { SelectV2Module } from '@app/shared/components/inputs/select-v2/select-v2.module';
import { RatingTeamUsersComponent } from '@app/components/rating/rating-team-users/rating-team-users.component';
import { RatingTeamsComponent } from '@app/components/rating/rating-teams/rating-teams.component';
import { TabsControlComponent } from '@app/components/rating/tabs-control/tabs-control.component';
import { RatingTeamUsersCardComponent } from '@app/components/rating/rating-team-users-card/rating-team-users-card.component';
import { TeamUsersCardComponent } from '@app/components/rating/team-users-card/team-users-card.component';
import { ProjectsUsersCardComponent } from '@app/components/rating/projects-users-card/projects-users-card.component';
import { DistributorsUsersCardComponent } from '@app/components/rating/distributors-users-card/distributors-users-card.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';

@NgModule({
	declarations: [
		MainMenuComponent,
		MobileMenuComponent,
		ProfilePopupComponent,
		AuctionSalesComponent,
		NotificationComponent,
		ThanksPartnerComponent,
		VictoryComponent,
		RatingComponent,
		AddVictoryModalComponent,
		BackendErrorMessagesComponent,
		PaginationComponent,
		CarouselComponent,
		ProfileCardComponent,
		UserCardComponent,
		UserCardWidgetComponent,
		VictoryModalComponent,
		UserInfoPopupComponent,
		AddVictoryModalResultComponent,
		VictoryCommentComponent,
		ThanksPartnerCardComponent,
		RatingTeamTabComponent,
		RatingTeamUsersComponent,
		RatingTeamsComponent,
		TabsControlComponent,
		RatingTeamUsersCardComponent,
		TeamUsersCardComponent,
		ProjectsUsersCardComponent,
		DistributorsUsersCardComponent,
	],
    imports: [
        CommonModule,
        FormsModule,
        NzFormModule,
        NzInputModule,
        NzModalModule,
        ReactiveFormsModule,
        RouterLink,
        NzIconModule,
        NzTabsModule,
        NzButtonModule,
        NzDropDownModule,
        NgScrollbar,
        NzListModule,
        NzAvatarModule,
        NzDatePickerModule,
        MaxLengthTextPipe,
        UpFirstPipe,
        NzPaginationModule,
        NzSelectModule,
        NzToolTipModule,
        DateTimePipe,
        CarouselModule,
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
        FormControlInputWithFuncEditModule,
        LikeModule,
        ChoiceLikeModule,
        ChoiceLikeModule,
        SelectModule,
        SearchClientInputModule,
        SearchUserInputModule,
        SelectV2Module,
        ModalTransportNoticeComponent,
        DateTimePickerComponent,
        MapperPipe,
    ],
	exports: [
		MainMenuComponent,
		MobileMenuComponent,
		ProfilePopupComponent,
		AuctionSalesComponent,
		NotificationComponent,
		ThanksPartnerComponent,
		VictoryComponent,
		RatingComponent,
		PaginationComponent,
		ProfileCardComponent,
		UserCardComponent,
		UserCardWidgetComponent,
		VictoryModalComponent,
		UserInfoPopupComponent,
		LikeComponent,
		AddVictoryModalResultComponent,
		VictoryCommentComponent,
		ThanksPartnerCardComponent,
		RatingTeamTabComponent,
		RatingTeamUsersComponent,
		RatingTeamsComponent,
		TabsControlComponent,
		RatingTeamUsersCardComponent,
		TeamUsersCardComponent,
		ProjectsUsersCardComponent,
		DistributorsUsersCardComponent,
	],
})
export class ComponentsModule {}
