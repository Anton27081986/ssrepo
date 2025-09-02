import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum VictoryEventEnum {
	victoryCreated = 'victoryCreated',
	victoryUpdated = 'victoryUpdated',
	victoryDeleted = 'victoryDeleted',
}

export enum VictoryLikeEventEnum {
	victoryLikeAdd = 'victoryLikeAdd',
	victoryLikeRemove = 'victoryLikeDeleted',
}

interface VictoryEvent {
	type: VictoryEventEnum;
}

interface VictoryLikeEvent {
	type: VictoryLikeEventEnum;
}

@Injectable({ providedIn: 'root' })
export class VictoryRootService {
	readonly event$: Subject<VictoryEvent> = new Subject<VictoryEvent>();
	readonly eventLike$: Subject<VictoryLikeEvent> =
		new Subject<VictoryLikeEvent>();
}
