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

    public addComment!: FormGroup;
    public submitted = false;
    public loading = false;
    public isConfirmLoading = false;

    commentVisible = false;

    constructor(
        private readonly apiService: ApiService,
        private readonly modal: NzModalRef,
        private readonly formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.addComment = this.formBuilder.group({
            comment: '',
        });
    }

    handleOk(): void {
        console.log('nzModalData');
    }

    search() {}
}
