import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {map} from 'rxjs';

@Component({
    selector: 'app-modal-info',
    templateUrl: './modal-info.component.html',
    styleUrls: ['./modal-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoComponent implements OnInit {
    // @Input() data?: any;

    // isVisibleOpenOut = true;
    readonly nzModalData: any = inject(NZ_MODAL_DATA);
    data: any;

    constructor(private readonly modal: NzModalRef) {}

    ngOnInit(): void {
        this.data = this.nzModalData;

        console.log('nzModalData', this.nzModalData);
        console.log('this.data', this.data);
    }

    closeModal(): void {
        this.modal.destroy();
    }

    saveAndCloseModal(value: boolean): void {
        this.modal.destroy(value);
    }

    handleCancelOpenOut(): void {
        // this.isVisibleOpenOut = false;
    }

    handleOkOpenOut(): void {
        // this.isVisibleOpenOut = false;
    }
}
