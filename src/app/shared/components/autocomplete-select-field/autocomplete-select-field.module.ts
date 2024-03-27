import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteSelectFieldComponent } from './autocomplete-select-field.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";



@NgModule({
	declarations: [
		AutocompleteSelectFieldComponent
	],
	exports: [
		AutocompleteSelectFieldComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		NzFormModule,
		NzGridModule,
		NzSelectModule,
		ReactiveFormsModule,
		CaptionModule
	]
})
export class AutocompleteSelectFieldModule { }
