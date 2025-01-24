import { Component, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { ModalService } from '@app/core/modal/modal.service';
import { SpecificationModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/add-specification-modal/specification-modal.component';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {TagV2Component} from "@app/shared/components/tag-v2/tag-v2.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {NumWithSpacesPipe} from "@app/core/pipes/num-with-spaces.pipe";
import {NgForOf} from "@angular/common";
import {TableV2Component} from "@app/shared/components/ss-table-v2/ss-table-v2.component";
import {
	SpecificationRowItemTrComponent
} from "@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/specification-row-item-tr/specification-row-item-tr.component";

@Component({
	selector: 'ss-completed-work-act-specifications',
	templateUrl: './completed-work-act-specifications.component.html',
	styleUrls: ['./completed-work-act-specifications.component.scss'],
	imports: [
		CardComponent,
		TextComponent,
		TagV2Component,
		ButtonComponent,
		NumWithSpacesPipe,
		NgForOf,
		TableV2Component,
		SpecificationRowItemTrComponent
	],
	standalone: true
})
export class CompletedWorkActSpecificationsComponent {
	protected specifications: Signal<ICompletedWorkActSpecification[]> = toSignal(
		this.completedWorkActsFacade.specifications$,
		{
			initialValue: [],
		},
	);

	protected specificationsTotalAmount: Signal<number | null> = toSignal(
		this.completedWorkActsFacade.specificationsTotalAmount$,
		{
			initialValue: null,
		},
	);

	public constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		private readonly modalService: ModalService,
	) {}

	public onAddSpecification() {
		this.modalService.open(SpecificationModalComponent);
	}
}
