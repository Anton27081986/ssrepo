import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-people-like-modal',
	templateUrl: './people-like-modal.component.html',
	styleUrls: ['./people-like-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleLikeModalComponent {}
