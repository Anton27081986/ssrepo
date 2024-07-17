import { NgModule } from '@angular/core';
import {
	AsyncPipe,
	NgClass,
	NgForOf,
	NgIf,
	NgStyle,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
	SlicePipe,
} from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { ScrollableBlockModule } from '@app/shared/components/scrollable-block/scrollable-block.module';

@NgModule({
	declarations: [TableV2Component],
	exports: [TableV2Component],
	imports: [
		NgForOf,
		NzTableModule,
		NzToolTipModule,
		SlicePipe,
		NgIf,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		NgClass,
		AsyncPipe,
		ScrollableBlockModule,
		NgStyle,
	],
})
export class TableV2Module {}
