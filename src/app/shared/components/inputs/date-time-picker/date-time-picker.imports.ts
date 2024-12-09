import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MaskitoDirective } from '@maskito/angular';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgClass } from '@angular/common';

export const DateTimePickerImports = [
	FormsModule,
	ReactiveFormsModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MaskitoDirective,
	IconModule,
	NgClass,
];
