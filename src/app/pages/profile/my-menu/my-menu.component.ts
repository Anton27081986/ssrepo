import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { MainMenuStoreService } from '@app/core/states/main-menu-store.service';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-my-menu',
	templateUrl: './my-menu.component.html',
	styleUrls: ['./my-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMenuComponent implements OnInit {
	public myMenuForm!: FormGroup;
	public listMenu!: IMenuItemDto[];
	public favorIteMenu!: any;
	public userProfile$?: Observable<IUserProfile | null>;
	public filterListMenu: IMenuItemDto[] = [];

	public constructor(
		private readonly mainMenuStoreService: MainMenuStoreService,
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly apiService: MenuApiService,
		private readonly formBuilder: FormBuilder,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit() {
		this.getMenu();
		this.getFavoriteMenu();

		this.myMenuForm = this.formBuilder.group({});
	}

	public getFavoriteMenu() {
		this.apiService
			.getFavoriteMenu()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				this.favorIteMenu = item.menu;
				this.cd.detectChanges();
			});
	}

	public getMenu() {
		this.apiService
			.getMenu()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				if (item.menu) {
					this.listMenu = item.menu;
					this.cd.detectChanges();
				}
			});
	}

	public updateItemsMenu() {
		this.mainMenuFacade.updateFavoriteMenu();
	}

	public addItemToFavorite(id: number) {
		this.apiService
			.addItemToFavoriteMenu(id)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.getFavoriteMenu();

				this.updateItemsMenu();
			});
	}

	public deleteItemToFavoriteMenu(id: number) {
		this.apiService
			.deleteItemToFavoriteMenu(id)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.getFavoriteMenu();

				this.updateItemsMenu();
			});
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}

	public filterItems($event: any) {
		if ($event.target.value.length > 2) {
			this.filterListMenu = [];
			this.listMenu.forEach((element: any) => {
				element.items.forEach((item: any) => {
					if (
						item.name
							.toLowerCase()
							.indexOf(String($event.target.value).toLowerCase()) !== -1
					) {
						this.filterListMenu.push(item);
					}
				});
			});
		} else {
			this.filterListMenu = [];
		}
	}
}
