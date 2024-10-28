import { NgModule } from '@angular/core';
import { AddressBookComponent } from '@app/widgets/address-book/address-book.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { AddressBookCardComponent } from '@app/widgets/address-book/address-book-card/address-book-card.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { ComponentsModule } from '@app/components/components.module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';

@NgModule({
	declarations: [AddressBookComponent, AddressBookCardComponent],
	exports: [AddressBookComponent, AddressBookCardComponent],
	imports: [
		CardModule,
		ReactiveFormsModule,
		NgIf,
		NgForOf,
		TextModule,
		InputModule,
		IconModule,
		ButtonModule,
		EmptyPlaceholderModule,
		HeadlineModule,
		AvatarModule,
		SsDividerModule,
		ComponentsModule,
		TooltipModule,
	],
})
export class AddressBookModule {}
