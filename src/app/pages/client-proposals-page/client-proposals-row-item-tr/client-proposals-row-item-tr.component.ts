import {
	AfterViewChecked,
	Component,
	ElementRef,
	input,
	Input,
	InputSignal,
	OnInit,
	ViewChild,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import {
	ClientProposalsTypeDocuments,
	IClientOffersDto,
	IFilesProposals,
} from '@app/core/models/client-proposails/client-offers';
import { IStoreTableBaseColumn } from '@app/core/store';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals/check-file-list-state.service';
import { BehaviorSubject } from 'rxjs';
import { ModalService } from '@app/core/modal/modal.service';
import { ClientProposalsViewFilesPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-view-files-popover/client-proposals-view-files-popover.component';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';
import {
	AsyncPipe,
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { IconComponent } from '@app/shared/components/icon/icon.component';

export enum ClientProposalsRowItemField {
	vgp = 'vgp',
	tg = 'tg',
	tpg = 'tpg',
	tpr = 'tpr',
	countKA = 'countKA',
	price = 'price',
	volumeOfSales = 'volumeOfSales',
	ratingTpr = 'ratingTpr',
	advantagesTpr = 'advantagesTpr',
	rim = 'rim',
	documents = 'documents',
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[app-client-proposals-row-item-tr]',
	styleUrls: ['client-proposals-row-item-tr.component.scss'],
	templateUrl: './client-proposals-row-item-tr.component.html',
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		NumWithSpacesPipe,
		TooltipDirective,
		IconComponent,
		NgSwitchDefault,
	],
	standalone: true,
})
export class ClientProposalsRowItemTrComponent
	implements OnInit, AfterViewChecked
{
	protected readonly ClientTprRowItemField = ClientProposalsRowItemField;
	public item: InputSignal<IClientOffersDto> =
		input.required<IClientOffersDto>();

	@Input()
	defaultCols: IStoreTableBaseColumn[] = [];

	protected advantagesTpr: string[] = [];

	protected viewMaximise$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	@ViewChild('content')
	public content!: ElementRef;

	protected rims$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<
		IFilesProposals[]
	>([]);

	protected documents$: BehaviorSubject<IFilesProposals[]> =
		new BehaviorSubject<IFilesProposals[]>([]);

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	constructor(
		public readonly columnsStateService: ColumnsStateService,
		public readonly checkListService: CheckFileListStateService,
		private readonly modalService: ModalService,
	) {}

	ngOnInit() {
		if (this.item) {
			if (this.item().promotionalMaterials) {
				this.rims$.next(
					this.item().promotionalMaterials.filter(
						(item) => item !== null,
					),
				);
			}

			if (this.item().documents) {
				this.documents$.next(
					this.item().documents.filter((item) => item !== null),
				);
			}

			if (this.item().advantages) {
				this.advantagesTpr = this.item().advantages.map((item) => {
					return item.name;
				});
			}
		}
	}

	ngAfterViewChecked() {
		if (this.content) {
			this.viewMaximise$.next(
				this.content.nativeElement.scrollHeight > 200,
			);
		}
	}

	showText(text: string[], title?: string) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell: text.map((item) => {
					return { text: item };
				}),
				title,
			},
		});
	}

	openPopoverRimsView() {
		const rims = this.rims$.value;

		this.modalService.open(ClientProposalsViewFilesPopoverComponent, {
			data: {
				files: rims,
				checkListService: this.checkListService,
				clientProposalsTypeDocuments: ClientProposalsTypeDocuments.rim,
			},
		});
	}

	openPopoverDocumentView() {
		const documents = this.documents$.value;

		this.modalService.open(ClientProposalsViewFilesPopoverComponent, {
			data: {
				files: documents,
				checkListService: this.checkListService,
				clientProposalsTypeDocuments:
					ClientProposalsTypeDocuments.documents,
			},
		});
	}
}
