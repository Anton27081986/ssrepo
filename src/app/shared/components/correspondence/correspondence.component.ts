import { Component, Input, OnInit } from '@angular/core';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';
import { filter, Observable } from 'rxjs';

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent implements OnInit {
	@Input() objectId: string | undefined;

	protected isHidden = false;

	public ratingWeeks$: Observable<string[]>;

	constructor(private readonly storeService: NotificationsStoreService) {
		this.ratingWeeks$ = this.storeService.subjects$;
	}

	ngOnInit() {
		if (this.objectId) {
			this.storeService.init(this.objectId);
		}
	}

	onHideButton() {
		this.isHidden = !this.isHidden;
	}
}
