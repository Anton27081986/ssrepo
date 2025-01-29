import { FormControl, FormGroup } from '@angular/forms';

export type SSForm<T> = {
	[Key in keyof Partial<T>]: FormControl | FormGroup;
};
