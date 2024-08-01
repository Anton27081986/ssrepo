import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { UsersApiService } from '@app/core/api/users-api.service';

@Component({
	selector: 'app-modal-info',
	templateUrl: './modal-info.component.html',
	styleUrls: ['./modal-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoComponent implements OnInit {
	public readonly nzModalData: any = inject(NZ_MODAL_DATA);
	public userData!: Observable<any>;

	public constructor(
		private readonly modal: NzModalRef,
		private readonly apiService: UsersApiService,
	) {}

	public ngOnInit(): void {
		this.userData = this.apiService.getUserById(this.nzModalData.data);
	}

	public closeModal(): void {
		this.modal.destroy();
	}

	public saveAndCloseModal(value: boolean): void {
		this.modal.destroy(value);
	}
}
