import { NgModule } from '@angular/core';
import { TableComponent } from '@app/shared/components/table/table.component';
import {
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
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TableFullCellModule } from '@app/shared/components/table-full-cell/table-full-cell.module';

@NgModule({
	declarations: [TableComponent],
	exports: [TableComponent],
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
		IconModule,
		TableFullCellModule,
		NgStyle,
	],
})
export class TableModule {}
