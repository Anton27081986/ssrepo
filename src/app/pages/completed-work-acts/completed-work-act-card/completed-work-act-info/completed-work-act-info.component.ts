import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { Permissions } from '@app/core/constants/permissions.constants';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import {
	CompletedWorkActsFacadeService
} from "@app/pages/completed-work-acts/services/completed-work-acts-facade.service";

@Component({
	selector: 'ss-completed-work-act-info',
	templateUrl: './completed-work-act-info.component.html',
	styleUrls: ['./completed-work-act-info.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		NgIf,
		ButtonComponent,
		IconComponent,
		DatePipe,
		NumWithSpacesPipe,
		NgForOf,
	],
	standalone: true,
})
export class CompletedWorkActInfoComponent {
	protected act: Signal<ICompletedWorkAct | null> = toSignal(
		this.completedWorkActsFacade.act$,
		{
			initialValue: null,
		}
	);

	public permissions: Signal<string[]> = toSignal(
		this.completedWorkActsFacade.permissions$,
		{
			initialValue: [],
		}
	);

	protected readonly Permissions = Permissions;
	constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService
	) {}

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
