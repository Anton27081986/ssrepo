import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from '@app/core/services/api.service';
import { Observable, tap } from 'rxjs';
import { VictoryService } from '@app/components/victory/victory.service';

@Component({
	selector: 'app-comments-modal',
	templateUrl: './comments-modal.component.html',
	styleUrls: ['./comments-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModalComponent implements OnInit {
	nzModalData: any = inject(NZ_MODAL_DATA);

	protected addComment!: FormGroup;
	protected submitted = false;
	protected isConfirmLoading = false;
	protected commentList!: Observable<any>;
	public currentUserId: any;

	public constructor(
		private readonly _apiService: ApiService,
		private readonly _victoryService: VictoryService,
		private readonly modal: NzModalRef,
		private readonly formBuilder: FormBuilder,
		private readonly chDRef: ChangeDetectorRef,
	) {
		// this.chDRef.detach();
	}

	ngOnInit() {
		this._apiService.getProfile().subscribe(profile => {
			this.currentUserId = profile.id;
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

		this._apiService.addCommets(objectId, type, awardId, note).subscribe(_ => {
			// Обновить комментарии переделать
			this.commentList = this.getCommentList(this.nzModalData.data.id, this.nzModalData.type);
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
			)
			.subscribe();
	}
}
