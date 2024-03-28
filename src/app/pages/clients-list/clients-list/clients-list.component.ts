import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { Observable } from 'rxjs';
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
	public clients$: Observable<IClientItemDto[]> | undefined;
	public total!: number;
	public pageSize = 50;
	public pageIndex = 1;
	public offset = 0;

	// state
	public isFiltersVisible: boolean = true;
	public filtersForm!: FormGroup;

	public radioValue: any = '1';

	public constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		private readonly formBuilder: FormBuilder,
	) {}

	public ngOnInit(): void {
		this.filtersForm = this.formBuilder.group({
			code: [''],
			category: ['55'],
			client: [''],
		});
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredClients() {
		console.log(this.filtersForm.get('category'));
		// if (this.filtersForm.valid) {
		// 	const filter = {
		// 		category: this.filtersForm.value.category,
		// 	};
		//
		// 	this.clientsListFacade.applyFilters(filter);
		// }
	}
}
