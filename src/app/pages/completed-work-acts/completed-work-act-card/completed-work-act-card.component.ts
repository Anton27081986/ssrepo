import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'ss-completed-work-act-card',
	templateUrl: './completed-work-act-card.component.html',
	styleUrls: ['./completed-work-act-card.component.scss'],
})
export class CompletedWorkActCardComponent {
	protected actId: number | undefined;

	public constructor(private readonly activatedRoute: ActivatedRoute) {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.actId = Number.parseInt(id, 10);
		}
	}
}
