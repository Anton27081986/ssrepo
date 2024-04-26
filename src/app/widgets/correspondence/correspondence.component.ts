import { Component, Input, OnInit } from '@angular/core';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent implements OnInit {
	@Input() public objectId: number | undefined;

	public constructor(private readonly notificationsFacadeService: CorrespondenceFacadeService) {}

	public ngOnInit() {
		if (this.objectId) {
			this.notificationsFacadeService.setObjectId(this.objectId);
		}
	}
}
