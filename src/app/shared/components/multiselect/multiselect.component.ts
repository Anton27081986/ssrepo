import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilterOption } from '@app/shared/components/filters/filters.component';

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

	constructor(
		private readonly changeDetector: ChangeDetectorRef,
		public readonly searchFacade: SearchFacadeService,
	) {}

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
		const query = (event.target as HTMLInputElement).value;

		if (query?.length) {
			switch (this.searchType) {
				case 'user':
					this.searchFacade
						.getUsers(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							const checkedOptions = this.options.filter(option => option.checked);

							this.options = [
								...checkedOptions,
								...res.items.filter((option: IFilterOption) => {
									const selectedOption = checkedOptions.find(
										checkedOption => checkedOption.id === option.id,
									);

									return !selectedOption;
								}),
							];

							this.changeDetector.detectChanges();
						});
					break;
				case 'client':
					this.searchFacade
						.getClients(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							const checkedOptions = this.options.filter(option => option.checked);

							this.options = [
								...checkedOptions,
								...res.items.filter((option: IFilterOption) => {
									const selectedOption = checkedOptions.find(
										checkedOption => checkedOption.id === option.id,
									);

									return !selectedOption;
								}),
							];

							this.changeDetector.detectChanges();
						});
					break;
				case 'contractor':
					this.searchFacade
						.getContractor(query)
						.pipe(untilDestroyed(this))
						.subscribe(res => {
							const checkedOptions = this.options.filter(option => option.checked);

							this.options = [
								...checkedOptions,
								...res.filter((option: IFilterOption) => {
									const selectedOption = checkedOptions.find(
										checkedOption => checkedOption.id === option.id,
									);

									return !selectedOption;
								}),
							];

							this.changeDetector.detectChanges();
						});
					break;
			}
		} else {
			this.options = this.options.filter(option => option.checked);

			this.changeDetector.detectChanges();
		}
	}

	getSelectedOptions() {
		return this.options?.filter(option => option.checked) || null;
	}
}
