import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-comments-modal',
    templateUrl: './comments-modal.component.html',
    styleUrls: ['./comments-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsModalComponent implements OnInit {
    readonly nzModalData: any = inject(NZ_MODAL_DATA);

    addComment!: FormGroup;
    submitted = false;
    isConfirmLoading = false;

    commentVisible = false;

    constructor(
        private readonly _apiService: ApiService,
        private readonly modal: NzModalRef,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        console.log('nzModalData', this.nzModalData);

        this.addComment = this.formBuilder.group({
            comment: '',
        });
    }

    handleOk(): void {
        const objectId = this.nzModalData.data.id;
        const type = this.nzModalData.type;
        const awardId = this.nzModalData.data.award;
        const note = this.addComment.get('comment')?.value;

        this._apiService.addCommets(objectId, type, awardId, note).subscribe()
    }
}
