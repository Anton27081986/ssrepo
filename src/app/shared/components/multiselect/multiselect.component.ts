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
import {IFilterOption} from "@app/shared/components/filters/filters.component";

export type SearchType = 'user' | 'client' | 'contractor';

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
	@Input() public options: IFilterOption[] = [];

	@Input() public searchType: SearchType | undefined;

	@Output() public getSelected = new EventEmitter<any>();
	public isOptionsVisible = false;

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

		this.getSelected.emit(this.getSelectedOptions());
	}

	protected onSearch(event: Event) {
		switch (this.searchType) {
			case 'user':
				this.searchFacade
					.getUsers((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = [...this.options.filter(option=>option.checked), ...res.items];
						this.changeDetector.detectChanges();
					});
				break;
			case 'client':
				this.searchFacade
					.getClients((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = [...this.options.filter(option=>option.checked), ...res.items];
						this.changeDetector.detectChanges();
					});
				break;
			case 'contractor':
				this.searchFacade
					.getContractor((event.target as HTMLInputElement).value)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.options = [...this.options.filter(option=>option.checked), ...res];
						this.changeDetector.detectChanges();
					});
				break;
		}
	}

	getSelectedOptions() {
		return this.options?.filter(option => option.checked) || null;
	}
}
