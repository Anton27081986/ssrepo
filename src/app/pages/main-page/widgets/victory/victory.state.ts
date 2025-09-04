import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class VictoryState {
	public readonly activeFuncCommentEdit$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
}
