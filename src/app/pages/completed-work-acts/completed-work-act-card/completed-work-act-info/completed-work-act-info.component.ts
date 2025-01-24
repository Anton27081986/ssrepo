import { Component, Signal } from '@angular/core';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {NumWithSpacesPipe} from "@app/core/pipes/num-with-spaces.pipe";

@Component({
	selector: 'ss-completed-work-act-info',
	templateUrl: './completed-work-act-info.component.html',
	styleUrls: ['./completed-work-act-info.component.scss'],
	imports: [
		CardComponent,
		TextComponent,
		NgIf,
		ButtonComponent,
		IconComponent,
		DatePipe,
		NgForOf,
		NumWithSpacesPipe
	],
	standalone: true
})
export class CompletedWorkActInfoComponent {
	protected act: Signal<ICompletedWorkAct | null> = toSignal(this.completedWorkActsFacade.act$, {
		initialValue: null,
	});

	public constructor(private readonly completedWorkActsFacade: CompletedWorkActsFacadeService) {}

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
