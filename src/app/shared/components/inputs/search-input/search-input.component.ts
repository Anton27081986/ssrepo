import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { BehaviorSubject } from 'rxjs';
import { IGlobalSearchDto } from '@app/core/models/company/global-search-dto';

export type searchType =
	| 'user'
	| 'user-dictionary'
	| 'subsector'
	| 'tovs'
	| 'region'
	| 'contractor'
	| 'client'
	| 'technologist'
	| 'contract'
	| 'global'
	| 'products'
	| undefined;

@UntilDestroy()
@Component({
	selector: 'ss-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public value: string = '';
	@Input() public data: string | undefined;
	@Input() public clear: boolean = false;
	@Input() public placeholder: string = 'Поиск';
	@Input() public error: string | undefined;
	@Input() public searchType: searchType;
	@Input() public clientId: number | undefined;
	@Input() selectedItem: IFilterOption | undefined;
	@Input() onlyActive: boolean = false;

	@Output() public select = new EventEmitter<any>();
	@Output() public blurEvent = new EventEmitter<null>();

	@ViewChild('options') public options!: ElementRef;

	public found$: BehaviorSubject<IDictionaryItemDto[]> = new BehaviorSubject<
		IDictionaryItemDto[]
	>([]);

	public constructor(
		private readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef,
	) {}

	private showHiddenOptions() {
		if (this.options) {
			this.options.nativeElement.scrollIntoView(false);
		}
	}

	protected onChange(query: string) {
		if (query.length > 2) {
			switch (this.searchType) {
				case 'user':
					this.searchFacade
						.getUsers(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'user-dictionary':
					this.searchFacade
						.getDictionaryUsers(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'subsector':
					this.searchFacade
						.getSubSectors(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'region':
					this.searchFacade
						.getRegions(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'contractor':
					if (query) {
						this.searchFacade
							.getContractor(query)
							.pipe(untilDestroyed(this))
							.subscribe(res => {
								this.found$.next(res.items);
								this.ref.detectChanges();
							});
					}

					break;
				case 'tovs':
					this.searchFacade
						.getTovs(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res);
							this.ref.detectChanges();
						});
					break;
				case 'technologist':
					this.searchFacade
						.getTechnologist(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res);
							this.ref.detectChanges();
							this.showHiddenOptions();
						});
					break;
				case 'client':
					this.searchFacade
						.getClients(query, this.onlyActive)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'contract':
					this.searchFacade
						.getContracts(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
				case 'global':
					this.searchFacade
						.globalSearch(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(this.mapIDictionaryItemDto(res.items));
						});
					break;
				case 'products':
					this.searchFacade
						.getProductSearch(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							this.found$.next(res.items);
							this.ref.detectChanges();
						});
					break;
			}
		}
	}

	public onBlur(): void {
		if (!this.value.trim()) {
			this.blurEvent.emit(null);
		}
	}

	public mapIDictionaryItemDto(items: IGlobalSearchDto[]): IDictionaryItemDto[] {
		return items.map(item => {
			return {
				id: 0,
				name: item.title,
				linkToDetail: item.linkToDetail,
			};
		});
	}
}
