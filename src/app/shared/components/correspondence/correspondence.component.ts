import { Component, Input, OnInit } from '@angular/core';
import { NotificationsStoreService } from '@app/core/states/notifications-store.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent implements OnInit {
	@Input() objectId!: number;

	protected isHidden = false;

	public subjects$: Observable<{subject: string; messageCount: number}[]>;

	constructor(private readonly storeService: NotificationsStoreService) {
		this.subjects$ = this.storeService.subjects$;
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
