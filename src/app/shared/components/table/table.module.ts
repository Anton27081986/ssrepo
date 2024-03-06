import { NgModule } from '@angular/core';
import { TableComponent } from '@app/shared/components/table/table.component';
import {NgForOf, NgIf, SlicePipe} from "@angular/common";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@NgModule({
	declarations: [TableComponent],
	exports: [TableComponent],
	imports: [
		NgForOf,
		NzTableModule,
		NzToolTipModule,
		SlicePipe,
		NgIf
	]
})
export class TableModule {}
