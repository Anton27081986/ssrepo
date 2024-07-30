import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
import {TableState} from "@app/shared/components/table/table-state";
import {Observable} from "rxjs";

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent implements OnChanges {
	@Input() public objectId: number | undefined;

	public isLoading$: Observable<boolean>;

	public constructor(private readonly notificationsFacadeService: CorrespondenceFacadeService) {
		this.isLoading$ = this.notificationsFacadeService.isLoading$;
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.objectId && this.objectId) {
			this.notificationsFacadeService.setObjectId(this.objectId);
		}
	}

	protected readonly TableState = TableState;
}
