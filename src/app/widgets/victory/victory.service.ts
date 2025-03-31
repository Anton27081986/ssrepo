import { Injectable } from '@angular/core';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { merge, of, switchMap, tap } from 'rxjs';
import { ICommentRequest } from '@app/core/models/awards/comment-request';
import { ILikeRequest } from '@app/core/models/awards/like-request';
import {
	VictoryLikeEventEnum,
	VictoryRootService,
} from '@app/widgets/victory/victory-root.service';

@Injectable({
	providedIn: 'root',
})
export class VictoryService {
	constructor(
		private readonly apiService: WinsApiService,
		private readonly victoryRootService: VictoryRootService,
	) {}

	/** Удаление комментария по id */
	public removeVictoryCommentById(id: number) {
		return this.apiService.removeVictoryCommentsById(id);
	}

	public getWins(pageSize: number, offset: number) {
		return merge(of(void 0), this.victoryRootService.event$).pipe(
			switchMap(() => this.apiService.getWins(pageSize, offset)),
		);
	}

	public getComments(request: ICommentRequest) {
		return merge(of(void 0), this.victoryRootService.event$).pipe(
			switchMap(() => this.apiService.getCommentsWins(request)),
		);
	}

	public getWin(id: number) {
		return this.apiService.getWin(id);
	}

	public getWinModal(id: number) {
		return merge(of(void 0), this.victoryRootService.eventLike$).pipe(
			switchMap(() => this.apiService.getWin(id)),
		);
	}

	public addComments(request: ICommentRequest) {
		return this.apiService.addCommentWins(request);
	}

	public updateComments(id: number, request: ICommentRequest) {
		return this.apiService.updateCommentWins(id, request);
	}

	public addLikeVictory(request: ILikeRequest) {
		return this.apiService.addLikeVictory(request).pipe(
			tap(() => {
				this.victoryRootService.eventLike$.next({
					type: VictoryLikeEventEnum.victoryLikeAdd,
				});
			}),
		);
	}

	public removeLikeVictory(request: ILikeRequest) {
		return this.apiService.removeLikeVictory(request).pipe(
			tap(() => {
				this.victoryRootService.eventLike$.next({
					type: VictoryLikeEventEnum.victoryLikeRemove,
				});
			}),
		);
	}
}
