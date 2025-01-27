import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {CommonModule, NgForOf, NgIf} from "@angular/common";

@UntilDestroy()
@Component({
	selector: 'app-my-menu',
	templateUrl: './my-menu.component.html',
	styleUrls: ['./my-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzFormItemComponent,
		NzFormControlComponent,
		NzInputGroupComponent,
		NzInputDirective,
		NzIconDirective,
		NgIf,
		NgForOf,
		NzFormDirective
	],
	standalone: true
})
export class MyMenuComponent implements OnInit {
	public myMenuForm!: FormGroup;
	public listMenu?: IMenuItemDto[] | null | undefined;
	public favorIteMenu?: IMenuItemDto[] | null;
	public userProfile$?: Observable<IUserProfile | null>;
	public filterListMenu: IMenuItemDto[] = [];

	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly formBuilder: FormBuilder,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit() {
		this.getMenu();
		this.getFavoriteMenu();

		this.myMenuForm = this.formBuilder.group({});
	}

	public getFavoriteMenu() {
		this.mainMenuFacade
			.getFavoriteItems()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				if (item !== null) {
					this.favorIteMenu = item![0]?.items;
				}
			});
	}

	public getMenu() {
		this.mainMenuFacade
			.getMainMenu()
			.pipe(untilDestroyed(this))
			.subscribe(item => {
				if (item !== null) {
					this.listMenu = item!.slice(1);
				}

				this.cd.markForCheck();
			});
	}

	public addItemToFavorite(item: IMenuItemDto) {
		this.mainMenuFacade.addFavoriteItem(item);

		this.cd.detectChanges();
	}

	public deleteItemToFavoriteMenu(item: IMenuItemDto, index: number) {
		this.mainMenuFacade.deleteFavoriteItem(item, index);

		this.cd.detectChanges();
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}

	public filterItems($event: any) {
		if ($event.target.value.length > 2) {
			this.filterListMenu = [];
			this.listMenu?.forEach(element => {
				element.items?.forEach(item => {
					if (
						item
							.name!.toLowerCase()
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
