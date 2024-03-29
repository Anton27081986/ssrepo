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

	public getFavoriteMainMenu(): Observable<IMenuItemDto[] | null> {
		return this.mainMenuSubject.asObservable();
	}

	public addFavoriteMenu(newItem: IMenuItemDto) {
		const currentMenu = this.mainMenuSubject.getValue();
		const favoriteMenuItems = currentMenu![0].items;

		favoriteMenuItems?.push(newItem);
		this.mainMenuSubject.next(currentMenu);
	}

	public deleteFavoriteMenu(newItem: IMenuItemDto, index: number) {
		const currentMenu = this.mainMenuSubject.getValue();
		const favoriteMenuItems = currentMenu![0].items;

		favoriteMenuItems?.splice(index, 1);
		this.mainMenuSubject.next(currentMenu);
	}
}
