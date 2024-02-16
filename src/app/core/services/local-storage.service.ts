import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly storageSub = new BehaviorSubject<string | null>(null);
	public storage$: Observable<string | null> = this.storageSub.asObservable();

	public setItem(key: string, value: any): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			this.storageSub.next('changed');
		} catch (e) {
			console.error('Error saving to localStorage', e);
		}
	}

	public getItem<T>(key: string): T | null {
		const item = localStorage.getItem(key);

		try {
			return item ? JSON.parse(item) : null;
		} catch (e) {
			console.error('Error getting data from localStorage', e);

			return null;
		}
	}

	public removeItem(key: string): void {
		localStorage.removeItem(key);
		this.storageSub.next('changed');
	}

	public clear(): void {
		localStorage.clear();
		this.storageSub.next('changed');
	}
}
