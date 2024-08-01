import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewContainerRef,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { CommentsModalComponent } from '@app/components/modal/comments-modal/comments-modal.component';
import { VictoryService } from '@app/components/victory/victory.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-card-victory',
	templateUrl: './card-victory.component.html',
	styleUrls: ['./card-victory.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardVictoryComponent {
	@Input() public item!: any;
	@Input() public extendedMode!: any;
	@Output() public DeleteWin = new EventEmitter<string>();

	public constructor(
		private readonly victoryService: VictoryService,
		public modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
	) {}

	// Модальное окно раскрытой карточки
	public showModalOpenOut(id: number): void {
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
			.afterClose.pipe(untilDestroyed(this))
			.subscribe();
	}

	// Модальное окно комментариев
	public showModalComments(data: any, type: number): void {
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
			.afterClose.pipe(untilDestroyed(this))
			.subscribe();
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}

	public onDeleteWin(item: any) {
		this.victoryService
			.removeVictoryById(item)
			.pipe(untilDestroyed(this))
			.subscribe(_ => {
				this.DeleteWin.emit(item);
			});
	}
}
