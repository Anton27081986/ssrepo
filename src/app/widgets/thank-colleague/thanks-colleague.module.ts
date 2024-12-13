import { NgModule } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { ChipsUserSearchModule } from '@app/shared/components/inputs/chips-user-search/chips-user-search.module';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';
import { ThanksColleagueComponent } from '@app/widgets/thank-colleague/thanks-colleague.component';
import { ThanksColleagueCardComponent } from '@app/widgets/thank-colleague/thanks-colleague-card/thanks-colleague-card.component';
import { AddThanksColleagueModalComponent } from '@app/widgets/thank-colleague/modal/add-thanks-colleague-modal/add-thanks-colleague-modal.component';
import { ComponentsModule } from '@app/components/components.module';
import { ChoiceLikeModule } from '@app/shared/components/choice-like/choice-like.module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { ThanksColleagueModalComponent } from '@app/widgets/thank-colleague/modal/thanks-colleague-modal/thanks-colleague-modal.component';
import {
	FormControlInputWithFuncEditModule
} from "@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.module";
import {LoaderModule} from "@app/shared/components/loader/loader.module";

@NgModule({
	declarations: [
		ThanksColleagueComponent,
		ThanksColleagueCardComponent,
		AddThanksColleagueModalComponent,
		ThanksColleagueModalComponent,
	],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        TextModule,
        ButtonModule,
        IconModule,
        SsDividerModule,
        AsyncPipe,
        NgIf,
        NgForOf,
        AvatarModule,
        EmptyPlaceholderModule,
        HeadlineModule,
        TextareaModule,
        ChipsUserSearchModule,
        ChipsSearchModule,
        CaptionModule,
        AttachmentModule,
        ComponentsModule,
        ChoiceLikeModule,
        TooltipModule,
        FormControlInputWithFuncEditModule,
        LoaderModule,
    ],
	exports: [
		ThanksColleagueComponent,
		ThanksColleagueCardComponent,
		AddThanksColleagueModalComponent,
		ThanksColleagueModalComponent,
	],
})
export class ThanksColleagueModule {}
