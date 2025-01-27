import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";
import {TooltipMenuComponent} from "@app/shared/components/tooltip-menu/tooltip-menu.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {SelectComponent} from "@app/shared/components/select/select.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {ReplacePipe} from "@app/shared/pipe/replace.pipe";

@UntilDestroy()
@Component({
	selector: 'ss-client-card-info',
	templateUrl: './client-card-info.component.html',
	styleUrls: ['./client-card-info.component.scss'],
	imports: [
		CommonModule,
		LoaderComponent,
		AsyncPipe,
		NgIf,
		HeadlineComponent,
		IconComponent,
		TooltipDirective,
		TooltipMenuComponent,
		CaptionComponent,
		ReactiveFormsModule,
		TextComponent,
		InputComponent,
		SelectComponent,
		NgForOf,
		SearchInputComponent,
		TextareaComponent,
		ButtonComponent,
		ReplacePipe
	],
	standalone: true
})
export class ClientCardInfoComponent implements OnInit {
	public client$: Observable<IClientDto | null>;
	public statuses$: Observable<IDictionaryItemDto[]>;
	public currentUser: IUserProfile | null | undefined;

	public isEditing = false;
	public canEdit: boolean = false;
	public visiblePriceList: boolean = false;
	public visibleCalculateDistributor: boolean = false;

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	protected infoForm!: FormGroup<{
		name: FormControl<string | null>;
		status: FormControl<number | null>;
		category: FormControl<string | null>;
		saleDirection: FormControl<string | null>;
		region: FormControl<string | null>;
		comment: FormControl<string | null>;
	}>;

	protected newCategoryId: number | undefined;
	protected newsaleDirectionId: number | undefined;
	protected newRegionId: number | undefined;

	public isLoading$: Observable<boolean>;

	public constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly notificationService: NzMessageService,
		private readonly userFacadeService: UserFacadeService,
	) {
		this.client$ = this.clientCardListFacade.client$;
		this.statuses$ = this.clientCardListFacade.statuses$;
		this.infoForm = new FormGroup({
			name: new FormControl<string>('', Validators.required),
			status: new FormControl<number>(0, Validators.required),
			category: new FormControl(),
			saleDirection: new FormControl(),
			region: new FormControl<string>('', Validators.required),
			comment: new FormControl(),
		});

		this.isLoading$ = this.clientCardListFacade.isInfoLoading$;
	}

	public ngOnInit() {
		this.client$.pipe(untilDestroyed(this)).subscribe(client => {
			this.infoForm.controls.name.setValue(client?.name || '');
			this.infoForm.controls.status.setValue(client?.status?.id || null);
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

		this.clientCardListFacade.permissions$.pipe(untilDestroyed(this)).subscribe(permissions => {
			this.canEdit = permissions.includes(Permissions.CLIENT_MAIN_INFO_EDIT);
			this.visiblePriceList = permissions.includes(Permissions.CLIENT_MAIN_INFO_PRICE_LIST);
			this.visibleCalculateDistributor = permissions.includes(
				Permissions.CLIENT_MAIN_INFO_CALCULATION_DISTRIBUTORS,
			);
		});

		this.clientCardListFacade.getStatuses();
	}

	public onEditing(status: boolean) {
		this.isEditing = status;

		if (!status) {
			this.clientCardListFacade.refreshClientCard();
		}
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
			status: this.infoForm.controls.status.value!,
			categoryId: this.newCategoryId,
			regionId: this.newRegionId,
			comments: this.infoForm.controls.comment.value,
		});

		this.infoForm.controls.comment.setValue(null);

		this.notificationService.success('Сохранено');
		this.isEditing = false;
	}

	public validators($event: any) {
		if ($event.target.selectionStart === 0 && $event.code === 'Space') {
			$event.preventDefault();
		}
	}
}
