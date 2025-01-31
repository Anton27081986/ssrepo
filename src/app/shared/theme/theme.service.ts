import { Injectable } from '@angular/core';

enum ThemeType {
	dark = 'dark',
	default = 'default',
}

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	public currentTheme = ThemeType.default;

	private reverseTheme(theme: string): ThemeType {
		return theme === ThemeType.dark ? ThemeType.default : ThemeType.dark;
	}

	public loadTheme(firstLoad = true) {
		const theme = this.currentTheme;

		if (firstLoad) {
			document.documentElement.classList.add(theme);
		}
	}

	public toggleTheme(){
		this.currentTheme = this.reverseTheme(this.currentTheme);
	}

	public setDefaultTheme() {
		this.currentTheme = ThemeType.default;
	}

	public setDarkTheme() {
		this.currentTheme = ThemeType.dark;
	}
}
