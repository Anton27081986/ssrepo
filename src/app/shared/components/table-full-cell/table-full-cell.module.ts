import { NgModule } from '@angular/core';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { CardModule } from '@app/shared/components/card/card.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';

@NgModule({
	declarations: [TableFullCellComponent],
	exports: [TableFullCellComponent],
	imports: [
		TextModule,
		ButtonModule,
		NgIf,
		CardModule,
		NgForOf,
		NgSwitchCase,
		NgSwitch,
		NgSwitchDefault,
		IconModule,
		HeadlineModule,
	],
})
export class TableFullCellModule {}
