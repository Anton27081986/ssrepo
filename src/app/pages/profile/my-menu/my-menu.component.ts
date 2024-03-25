import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuApiService } from '@app/core/api/menu-api.service';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IMenu } from '@app/core/models/menu/menu';

@UntilDestroy()
@Component({
	selector: 'app-my-menu',
	templateUrl: './my-menu.component.html',
	styleUrls: ['./my-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMenuComponent implements OnInit {
	public myMenuForm!: FormGroup;
	public listMenu!: IMenu[];
	public favorIteMenu!: any;
	public userProfile$?: Observable<IUserProfile | null>;
	public filterListMenu: IMenu[] = [];

	public constructor(
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
				this.listMenu = item.menu;
				this.cd.detectChanges();
			});
	}

	public addItemToFavorite(id: number) {
		this.apiService
			.addItemToFavoriteMenu(id)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.getFavoriteMenu();
			});
	}

	public deleteItemToFavoriteMenu(id: number) {
		this.apiService
			.deleteItemToFavoriteMenu(id)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.getFavoriteMenu();
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
