import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	AccordionComponent,
	AccordionItemComponent,
	Colors,
	ExtraSize,
	IconComponent,
	IconPosition,
	IconType,
	LinkAppearance,
	LinkComponent,
	ModalRef,
	RightSidePagePopupComponent,
	Shape,
	TagType,
	TextComponent,
	TextType,
} from '@front-library/components';
import { NotificationComponent } from '@app/pages/contractors-dictionary/notification/notification.component';
import { IContractorCardSidePageData } from '@app/pages/contractors-dictionary/models/contractor-card-side-page-data';
import { NgOptimizedImage } from '@angular/common';
import { InfoSectionComponent } from '@app/pages/contractors-dictionary/info-section/info-section.component';
import { InfoRowComponent } from '@app/pages/contractors-dictionary/info-row/info-row.component';
import { ContractorsDictionaryService } from '@app/pages/contractors-dictionary/services/contractors-dictionary.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-contractor-card-dialog',
	standalone: true,
	imports: [
		RightSidePagePopupComponent,
		LinkComponent,
		AccordionComponent,
		AccordionItemComponent,
		NotificationComponent,
		TextComponent,
		IconComponent,
		NgOptimizedImage,
		InfoSectionComponent,
		InfoRowComponent,
	],
	templateUrl: './contractor-card-dialog.component.html',
	styleUrl: './contractor-card-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractorCardDialogComponent {
	private readonly contractorsDictionaryService = inject(
		ContractorsDictionaryService
	);

	private readonly popup: ModalRef<IContractorCardSidePageData> = inject(
		ModalRef<IContractorCardSidePageData>
	);

	protected quickViewData = toSignal(
		this.contractorsDictionaryService.quickView(this.popup.data.id)
	);

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly IconPosition = IconPosition;
	protected readonly LinkAppearance = LinkAppearance;
	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly TagType = TagType;

	protected get titleHeader(): string {
		return `КДВ ГРУПП #${this.popup.data.id}`;
	}

	protected booleanAnswer(value: boolean): string {
		return value ? 'Да' : 'Нет';
	}

	protected close(): void {
		this.popup.close();
	}

	protected openCard(): void {
		window.open('', '_blank');
	}
}
