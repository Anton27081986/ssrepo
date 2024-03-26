import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';

@Injectable({
	providedIn: 'root',
})
export class MainMenuStoreService {
	private readonly mainMenuSubject = new BehaviorSubject<IMenuItemDto[] | null>(null);

	public getMainMenu(): Observable<IMenuItemDto[] | null> {
		return this.mainMenuSubject.asObservable();
	}

	public setMainMenu(newMainMenu: IMenuItemDto[]) {
		this.mainMenuSubject.next(newMainMenu);
	}
}
