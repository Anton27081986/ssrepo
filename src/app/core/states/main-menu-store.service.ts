import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { MenuApiService } from '@app/core/api/menu-api.service';

@Injectable({
	providedIn: 'root',
})
export class MainMenuStoreService {
	private readonly mainMenuSubject = new BehaviorSubject<IMenuItemDto[] | null>(null);

	private readonly menuSubject = new BehaviorSubject<any>(null);
	public menu$ = this.menuSubject.asObservable();

	public constructor(private readonly apiService: MenuApiService) {}

	public getMainMenu(): Observable<IMenuItemDto[] | null> {
		return this.mainMenuSubject.asObservable();
	}

	public setMainMenu(newMainMenu: IMenuItemDto[]) {
		this.mainMenuSubject.next(newMainMenu);
	}

	public updateFavoriteMenu(): Observable<any> {
		return this.apiService.getFavoriteMenu().pipe(
			map(({ menu }) => menu),
			tap(x => {
				this.menuSubject.next(x);
			}),
		);
	}
}
