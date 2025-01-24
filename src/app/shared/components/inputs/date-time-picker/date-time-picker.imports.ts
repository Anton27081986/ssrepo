import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MaskitoDirective } from '@maskito/angular';
import { NgClass } from '@angular/common';
import {IconComponent} from "@app/shared/components/icon/icon.component";

export const DateTimePickerImports = [
	FormsModule,
	ReactiveFormsModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MaskitoDirective,
	IconComponent,
	NgClass,
];
