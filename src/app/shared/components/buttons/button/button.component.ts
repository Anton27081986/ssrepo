import { Component } from '@angular/core';

enum Themes {
	'default',
	'dark',
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ss-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	protected theme: Themes = Themes.default;

	switchTheme() {
		this.theme = this.theme === Themes.default ? Themes.dark : Themes.default;
	}
}
