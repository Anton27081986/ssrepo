import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export type SearchType = 'user' | 'client' | 'contractor';

interface ISelectedOption extends IDictionaryItemDto {
	checked?: boolean;
}

@UntilDestroy()
@Component({
	selector: 'ss-multiselect',
	templateUrl: './multiselect.component.html',
	styleUrls: ['./multiselect.component.scss'],
})
export class MultiselectComponent {
	@Input() public label: string | undefined;
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public placeholder: string | undefined;
	@Input() public multiple = false;
	@Input() public options: ISelectedOption[] | undefined = [];

	@Input() public searchType: SearchType | undefined;

	@Output() public getSelected = new EventEmitter<any>();
	public isOptionsVisible = false;
	public selectedOptions: ISelectedOption[] = [];

	@ViewChild('optionsEl', { static: false }) public optionsEl: ElementRef | undefined;

	constructor(
		private readonly changeDetector: ChangeDetectorRef,
		public readonly searchFacade: SearchFacadeService,
	) {
		document.addEventListener('click', e => {
			e.stopPropagation();

			if (this.isOptionsVisible && !(e.target as HTMLElement).classList.contains('option')) {
				this.isOptionsVisible = false;
				this.changeDetector.detectChanges();
			}
		});
	}

	public changeState(e: Event) {
		e.stopPropagation();
		this.isOptionsVisible = !this.isOptionsVisible;
		this.changeDetector.detectChanges();
	}

	public onSelect(id: number) {
		const option = this.options?.find(option => option.id === id);

		if (option) {
			option.checked = !option.checked;
		}

		this.selectedOptions = this.options?.filter(option => option.checked) || [];

		this.getSelected.emit(this.selectedOptions);
	}

	protected onSearch(event: Event) {
		switch (this.searchType) {
			case 'user':
				this.searchFacade
					.getUsers((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = res.items;
						this.changeDetector.detectChanges();
					});
				break;
			case 'client':
				this.searchFacade
					.getSubSectors((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = res.items;
						this.changeDetector.detectChanges();
					});
				break;
			case 'contractor':
				this.searchFacade
					.getContractor((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = res;
						this.changeDetector.detectChanges();
					});
				break;
		}
	}
}
