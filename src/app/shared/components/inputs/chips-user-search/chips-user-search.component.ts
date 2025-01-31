import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@UntilDestroy()
@Component({
	selector: 'ss-chips-user-search',
	templateUrl: './chips-user-search.component.html',
	styleUrls: ['./chips-user-search.component.scss'],
	imports: [
		CommonModule,
		CaptionComponent,
		AvatarComponent,
		NgClass,
		TextComponent,
		IconComponent,
		NgForOf,
		NgIf
	],
	standalone: true
})
export class ChipsUserSearchComponent {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = 'Введите ФИО';
	@Input() public error: string | undefined;
	@Input() public selectedItems: any[] = [];

	@ViewChild('input') public input!: ElementRef;

	protected foundItems: any[] = [];
	public constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly usersApiService: UsersApiService,
	) {}

	protected onInputChange(value: string) {
		if (value.length > 2) {
			this.usersApiService
				.getUsersByFIO(value)
				.pipe(
					map(({ items }) => items),
					untilDestroyed(this),
				)
				.subscribe(res => {
					if (this.selectedItems?.length) {
						const selectedIds = this.selectedItems.map(item => item.id);

						this.foundItems = res.filter(
							(item: { id: any }) => !selectedIds.includes(item.id),
						);
					} else {
						this.foundItems = res;
					}

					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.foundItems = [];
			this.changeDetectorRef.detectChanges();
		}
	}

	protected onAddItemToList(item: any) {
		this.selectedItems.push(item);
		this.foundItems = [];
		setTimeout(() => {
			this.input.nativeElement.value = '';
			this.input.nativeElement.focus();
		}, 0);
	}

	protected onRemoveItemFromList(i: any) {
		this.selectedItems.splice(i, 1);
	}

	protected dontSend(event: any): any {
		const key = event.which || event.keyCode;

		if (key === 13) {
			return false;
		}
	}
}
