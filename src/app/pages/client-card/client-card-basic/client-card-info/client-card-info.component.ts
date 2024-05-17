import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { IClientStatus } from '@app/core/models/company/client-status';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserFacadeService } from '@app/core/facades/user-facade.service';

enum ClientStatusesEnum {
	'Новый' = 1,
	'Архив' = 2,
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
	public currentUser: IUserProfile | null | undefined;

	public isEditing = false;

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	protected clientStatuses = ClientStatusesEnum;

	protected infoForm!: FormGroup<{
		name: FormControl<string | null>;
		status: FormControl<IClientStatus | null>;
		category: FormControl<string | null>;
		saleDirection: FormControl<string | null>;
		region: FormControl<string | null>;
		comment: FormControl<string | null>;
	}>;

	protected newCategoryId: number | undefined;
	protected newsaleDirectionId: number | undefined;
	protected newRegionId: number | undefined;

	public constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly notificationService: NzMessageService,
		private readonly userFacadeService: UserFacadeService,
	) {
		this.client$ = this.clientCardListFacade.client$;
		this.infoForm = new FormGroup({
			name: new FormControl<string>('', Validators.required),
			status: new FormControl(),
			category: new FormControl(),
			saleDirection: new FormControl(),
			region: new FormControl<string>('', Validators.required),
			comment: new FormControl(),
		});
	}

	public ngOnInit() {
		this.client$.pipe(untilDestroyed(this)).subscribe(client => {
			this.infoForm.controls.name.setValue(client?.name || '');
			this.infoForm.controls.status.setValue(client?.status || null);
			this.infoForm.controls.category.setValue(client?.category?.name || null);
			this.infoForm.controls.region.setValue(client?.region?.name || null);
			this.infoForm.controls.saleDirection.setValue(client?.mainSector || null);
			this.newCategoryId = client?.category?.id;
			this.newRegionId = client?.region?.id;
		});

		this.userFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe(user => {
				this.currentUser = user;
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

	public saveChanges() {
		if (this.infoForm.invalid) {
			return this.infoForm.markAllAsTouched();
		}

		this.clientCardListFacade.saveInfo({
			name: this.infoForm.controls.name.value,
			status: this.infoForm.controls.status.value || ClientStatusesEnum.Новый,
			categoryId: this.newCategoryId,
			regionId: this.newRegionId,
			comment: this.infoForm.controls.comment.value,
		});

		this.notificationService.success('Сохранено');
		this.isEditing = false;
	}

	public validators($event: any) {
		if ($event.target.selectionStart === 0 && $event.code === 'Space') {
			$event.preventDefault();
		}
	}
}
