import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { FormBuilder, FormGroup } from '@angular/forms';

@UntilDestroy()
@Component({
	selector: 'app-clients-list',
	templateUrl: './clients-list.component.html',
	styleUrls: ['./clients-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsListComponent implements OnInit {
	// table
	public clients$: Observable<IClientItemDto[]>;
	public total!: number;
	public pageSize = 50;
	public pageIndex = 1;
	public offset = 0;

	// state
	public isFiltersVisible: boolean = false;
	public filtersForm!: FormGroup;

	// category filter dictionary

	public nzFilterOption = (): boolean => true;
	public categoriesOptions: Array<{ name: string; id: string }> = [];

	public constructor(
		private readonly clientsListFacade: ClientsListFacadeService,
		private readonly formBuilder: FormBuilder,
	) {
		this.clients$ = new BehaviorSubject<IClientItemDto[]>([]).asObservable();
	}

	public ngOnInit(): void {
		// this.clients$ = this.clientsListFacade.getClients();

		this.filtersForm = this.formBuilder.group({
			code: [''],
			category: [''],
		});
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredClients() {
		if (this.filtersForm.valid) {
			const filter = {
				category: this.filtersForm.value.category,
			};

			this.clientsListFacade.applyFilters(filter);
		}
	}

	// category
	public get category() {
		return this.filtersForm.get('category');
	}

	public categorySearch($event: string) {}
}
