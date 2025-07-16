import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { CommonModule, NgClass } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';

export type searchType =
	| 'user'
	| 'subsector'
	| 'tovs'
	| 'region'
	| 'contractor'
	| 'contract'
	| 'client'
	| 'technologist'
	| 'productions'
	| 'productionsTpr'
	| string
	| 'tovGroups'
	| undefined;

@UntilDestroy()
@Component({
	selector: 'ss-chips-search',
	templateUrl: './chips-search.component.html',
	styleUrls: ['./chips-search.component.scss'],
	imports: [CommonModule, CaptionComponent, NgClass, IconComponent, TextComponent],
	standalone: true,
})
export class ChipsSearchComponent {
	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public disabled = false;

	@Input()
	public label: string | undefined;

	@Input()
	public placeholder = 'Введите ФИО';

	@Input()
	public error: string | undefined;

	@Input()
	public selectedItems: any[] = [];

	@Input()
	public searchType: searchType = 'user';

	@Output()
	public getSelected = new EventEmitter<any>();

	@ViewChild('input')
	public input!: ElementRef;

	protected found: any[] = [];

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		public readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef,
	) {}

	protected onInputChange(query: string) {
		if (query.length > 2) {
			switch (this.searchType) {
				case 'user':
					this.searchFacade
						.getUsers(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'subsector':
					this.searchFacade
						.getSubSectors(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'region':
					this.searchFacade
						.getRegions(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'contractor-company':
					if (query) {
						this.searchFacade
							.getContractorsCompany(query)
							.pipe(untilDestroyed(this))
							.subscribe((res) => {
								this.found = res.items;
								this.ref.detectChanges();
							});
					}

					break;
				case 'client-company':
					this.searchFacade
						.getClientsCompany(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'tov-company':
					this.searchFacade
						.getTovCompany(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'contractor':
					if (query) {
						this.searchFacade
							.getContractor(query)
							.pipe(untilDestroyed(this))
							.subscribe((res) => {
								this.found = res.items;
								this.ref.detectChanges();
							});
					}

					break;
				case 'personificationStatuses':
					this.searchFacade
						.getPersonificationStatuses(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'tovs':
					this.searchFacade
						.getTovs(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'technologist':
					this.searchFacade
						.getTechnologist(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'client':
					this.searchFacade
						.getClients(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'productions':
					this.searchFacade
						.getProductions(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'tovGroups':
					this.searchFacade
						.getTovGroups(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
				case 'productionsTpr':
					this.searchFacade
						.getProductSearch(query)
						.pipe(untilDestroyed(this))
						.subscribe((res) => {
							this.found = res.items;
							this.ref.detectChanges();
						});
					break;
			}
		} else {
			this.found = [];
			this.changeDetectorRef.detectChanges();
		}
	}

	protected onAddItemToList(item: any) {
		this.selectedItems.push(item);
		this.found = [];
		setTimeout(() => {
			this.input.nativeElement.value = '';
			this.input.nativeElement.focus();
			this.getSelected.emit(this.selectedItems);
		}, 0);
	}

	protected onRemoveItemFromList(i: any) {
		this.selectedItems.splice(i, 1);
		this.getSelected.emit(this.selectedItems);
	}

	protected dontSend(event: any): any {
		const key = event.which || event.keyCode;

		if (key === 13) {
			return false;
		}
	}
}
