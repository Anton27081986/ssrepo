import { Component, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Component({
	selector: 'ss-completed-work-act-info',
	templateUrl: './completed-work-act-info.component.html',
	styleUrls: ['./completed-work-act-info.component.scss'],
})
export class CompletedWorkActInfoComponent {
	protected act: Signal<ICompletedWorkAct | null> = toSignal(this.completedWorkActsFacade.act$, {
		initialValue: null,
	});

	protected finDocOrders: IDictionaryItemDto[] = [];

	public constructor(private readonly completedWorkActsFacade: CompletedWorkActsFacadeService) {
		this.finDocOrders = this.act()?.finDocOrders || [];
	}

	protected switchMode() {
		this.completedWorkActsFacade.switchMode();
	}

	protected downloadFile(url: string, fileName: string) {
		const link = document.createElement('a');

		link.href = url;
		link.target = '_blank';
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
