import { Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '@app/core/utils/format-datepicker.helper';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const DATE_TIME_PICKER_PROVIDERS: Provider[] = [
	{
		provide: DateAdapter,
		useClass: CustomDateAdapter,
	},
	{
		provide: MAT_DATE_LOCALE,
		useValue: 'ru-RU',
	},
	{
		provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
		useValue: {
			subscriptSizing: 'dynamic',
		},
	},
];
