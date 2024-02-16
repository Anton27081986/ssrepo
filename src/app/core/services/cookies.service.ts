import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CookiesService {
	// public getCookie(name: string): string | null {
	// 	return this.cookieService.get(name);
	// }
	// public setCookie(name: string, value: string, days?: number): void {
	// 	let expiryDate;
	//
	// 	if (days) {
	// 		expiryDate = new Date();
	// 		expiryDate.setDate(expiryDate.getDate() + days);
	// 	}
	//
	// 	this.cookieService.set(name, value, { expires: expiryDate, path: '/' });
	// }
	//
	// public deleteCookie(name: string): void {
	// 	this.cookieService.delete(name, '/');
	// }
	//
	// public clearAllCookies(): void {
	// 	this.cookieService.deleteAll('/');
	// }
}
