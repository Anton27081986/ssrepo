import { Component, OnInit } from '@angular/core';
import { async, Observable } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { IClientStatus } from '@app/core/models/company/client-status';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum ClientStatusesEnum {
	'Новый' = 1,
	'Архив' = 2,
	'Передано в юр.отдел' = 5,
	'Действующий' = 6,
}

@UntilDestroy()
@Component({
	selector: 'ss-client-card-info',
	templateUrl: './client-card-info.component.html',
	styleUrls: ['./client-card-info.component.scss'],
})
export class ClientCardInfoComponent implements OnInit {
	public client$: Observable<IClientDto | null>;

	public isEditing = false;

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	protected clientStatuses = ClientStatusesEnum;

	protected infoForm!: FormGroup<{
		name: FormControl<string | null>;
		status: FormControl<IClientStatus | null>;
		category: FormControl<string | null>;
		region: FormControl<string | null>;
	}>;

	protected newCategoryId: number | undefined;
	protected newRegionId: number | undefined;

	public constructor(public readonly clientCardListFacade: ClientsCardFacadeService) {
		this.client$ = this.clientCardListFacade.client$;
		this.infoForm = new FormGroup({
			name: new FormControl(),
			status: new FormControl(),
			category: new FormControl(),
			region: new FormControl(),
		});
	}

	ngOnInit() {
		this.client$.pipe(untilDestroyed(this)).subscribe(client => {
			this.infoForm.controls.name.setValue(client?.name || '');
			this.infoForm.controls.status.setValue(client?.status || null);
			this.infoForm.controls.category.setValue(client?.category?.name || null);
			this.infoForm.controls.region.setValue(client?.region?.name || null);
			this.newCategoryId = client?.category?.id;
			this.newRegionId = client?.region?.id;
		});
	}

	public onEditing(status: boolean) {
		this.isEditing = status;
	}

	public selectCategory(category: { id: number; name: string }) {
		this.newCategoryId = category.id;
	}

	public selectRegion(region: { id: number; name: string }) {
		this.newRegionId = region.id;
	}

	saveChanges() {
		this.clientCardListFacade
			.saveInfo({
				name: this.infoForm.controls.name.value,
				status: this.infoForm.controls.status.value!,
				categoryId: this.newCategoryId,
				regionId: this.newRegionId,
			})
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.clientCardListFacade.refreshClientCard();
				this.isEditing = false;
			});
	}
}
