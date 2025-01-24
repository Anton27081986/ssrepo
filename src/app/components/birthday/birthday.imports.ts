import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';

export const BirthdayImports = [
	AsyncPipe,
	ReactiveFormsModule,
	MapperPipe,
	DateTimePickerComponent,
];
