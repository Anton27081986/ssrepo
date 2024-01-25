import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {ApiService} from '@app/shared/services/api/api.service';
import {Observable, tap} from 'rxjs';

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

    constructor(
        private readonly _apiService: ApiService,
        private readonly modal: NzModalRef,
        private readonly formBuilder: FormBuilder,
        private readonly chDRef: ChangeDetectorRef,
    ) {
        // this.chDRef.detach();
    }

    ngOnInit() {
        // this.commentList = this._apiService.getComment(
        //     this.nzModalData.data.id,
        //     this.nzModalData.type,
        //     0,
        //     6,
        // );

        this.commentList = this.getCommentList(this.nzModalData.data.id, this.nzModalData.type);

        this.addComment = this.formBuilder.group({
            comment: [
                null,
                [Validators.required, Validators.nullValidator, Validators.maxLength(400)],
            ],
        });
    }

    getCommentList(id: number, type: number) {
        // Поправить CD
        return this._apiService.getComment(id, type, 0, 6).pipe(
            tap(_ => {
                this.chDRef.markForCheck();
            }),
        );
    }

    handleOk(): void {
        const objectId = this.nzModalData.data.id;
        const type = this.nzModalData.type;
        const awardId = this.nzModalData.data.award;
        const note = this.addComment.get('comment')?.value;

        this._apiService
            .addCommets(objectId, type, awardId, note)
            .pipe(
                tap(_ => {
                    this.chDRef.markForCheck();
                }),
            )
            .subscribe();

        // Обновить комментарии переделать
        this.commentList = this.getCommentList(this.nzModalData.data.id, this.nzModalData.type);

        // Валидация
        if (this.addComment.valid) {
            // console.log('valid')
        } else {
            Object.values(this.addComment.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
        }

        // Сборосить форму
    }

    removeComment($event: any, id: number) {
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
