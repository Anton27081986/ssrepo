import { AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl) {
	const passwordRegex = /(?=.*[0-9])(?=.*[!?@#_;:)($%^&*+=])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!?@#_;:)($%^&*+=]{8,}/g;

	if (!passwordRegex.test(control.value)) {
		return { password: true };
	}
	return null;
}
