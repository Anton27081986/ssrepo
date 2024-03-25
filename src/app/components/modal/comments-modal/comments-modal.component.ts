import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { VictoryService } from '@app/components/victory/victory.service';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { CommentsApiService } from '@app/core/api/comments-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-comments-modal',
	templateUrl: './comments-modal.component.html',
	styleUrls: ['./comments-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModalComponent implements OnInit {
	public nzModalData: any = inject(NZ_MODAL_DATA);

	protected addComment!: FormGroup;
	protected submitted = false;
	protected isConfirmLoading = false;
	protected commentList!: Observable<any>;
	public currentUserId?: number;

	public constructor(
		private readonly _apiService: CommentsApiService,
		private readonly _victoryService: VictoryService,
		private readonly formBuilder: FormBuilder,
		private readonly chDRef: ChangeDetectorRef,
		private readonly userStateService: UserProfileStoreService,
	) {}

	public ngOnInit() {
		this.userStateService.userProfile$.pipe(untilDestroyed(this)).subscribe(userProfile => {
			this.currentUserId = userProfile?.id;
		});

		this.commentList = this.getCommentList(this.nzModalData.data.id, this.nzModalData.type);

		this.addComment = this.formBuilder.group({
			comment: [
				null,
				[Validators.required, Validators.minLength(2), Validators.maxLength(3000)],
			],
		});
	}

	public get comment() {
		return this.addComment.get('comment');
	}

	public getCommentList(id: number, type: number) {
		// TODO сделать прокрутку с пагинацией
		return this._apiService.getComment(id, type, 0, 30).pipe(
			tap(_ => {
				this.chDRef.markForCheck();
			}),
		);
	}

	public handleOk(): void {
		const objectId = this.nzModalData.data.id;
		const type = this.nzModalData.type;
		const awardId = this.nzModalData.data.award;
		const note = this.addComment.get('comment')?.value;

		this._apiService
			.addCommets(objectId, type, awardId, note)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				// Обновить комментарии переделать
				this.commentList = this.getCommentList(
					this.nzModalData.data.id,
					this.nzModalData.type,
				);
				this.chDRef.detectChanges();
			});

		// Валидация
		if (this.addComment.valid) {
			// console.log('valid')
		} else {
			Object.values(this.addComment.controls).forEach(control => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
		}

		// Сборосить форму
		this.addComment.reset();

		this._victoryService.updateWinList(Math.random());
	}

	public removeComment($event: any, id: number) {
		$event.stopPropagation();

		this._apiService
			.removeCommentById(id)
			.pipe(
				tap(_ => {
					this.commentList = this.getCommentList(
						this.nzModalData.data.id,
						this.nzModalData.type,
					);
					this.chDRef.markForCheck();
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
