import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-modal-info',
    templateUrl: './modal-info.component.html',
    styleUrls: ['./modal-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoComponent implements OnInit {
    readonly nzModalData: any = inject(NZ_MODAL_DATA);
    userData!: Observable<any>;

    constructor(
        private readonly modal: NzModalRef,
        private readonly apiService: ApiService,
    ) {}

    ngOnInit(): void {
        console.log('nzModalData', this.nzModalData.data);
        this.userData = this.apiService.getUserById(this.nzModalData.data.user.id);
    }

    closeModal(): void {
        this.modal.destroy();
    }

    saveAndCloseModal(value: boolean): void {
        this.modal.destroy(value);
    }
}
