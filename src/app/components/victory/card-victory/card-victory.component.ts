import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { CommentsModalComponent } from '@app/components/modal/comments-modal/comments-modal.component';
import { VictoryService } from '@app/components/victory/victory.service';

@Component({
	selector: 'app-card-victory',
	templateUrl: './card-victory.component.html',
	styleUrls: ['./card-victory.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardVictoryComponent {
	@Input() item!: any;
	@Input() extendedMode!: any;
	@Output() DeleteWin = new EventEmitter<string>();

	constructor(
		private readonly victoryService: VictoryService,
		private readonly formBuilder: FormBuilder,
		private readonly iconService: NzIconService,
		public modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly chDRef: ChangeDetectorRef,
	) {}

	// Модальное окно раскрытой карточки
	showModalOpenOut(id: number): void {
		this.modalCreate
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: 'Информация о пользователе',
				nzNoAnimation: false,
				nzWidth: '365px',
				nzContent: ModalInfoComponent,
				nzViewContainerRef: this.viewContainerRef,
				nzData: {
					data: id,
				},
			})
			.afterClose.subscribe();
	}

	// Модальное окно комментариев
	showModalComments(data: any, type: number): void {
		this.modalCreate
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: `Победа № ${data.user.id}`,
				nzNoAnimation: false,
				nzWidth: '560px',
				nzContent: CommentsModalComponent,
				nzViewContainerRef: this.viewContainerRef,
				nzData: {
					data,
					type,
				},
			})
			.afterClose.subscribe();
	}

	trackBy(_index: number, item: any) {
		return item.id;
	}

	onDeleteWin(item: any) {
		this.victoryService.removeVictoryById(item).subscribe(_ => {
			this.DeleteWin.emit(item);
		});
	}
}
