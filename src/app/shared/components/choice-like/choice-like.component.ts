import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { LikeStateEnum } from '@app/shared/components/like/like.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@UntilDestroy()
@Component({
	selector: 'app-choice-like',
	templateUrl: './choice-like.component.html',
	styleUrls: ['./choice-like.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconComponent],
	standalone: true,
})
export class ChoiceLikeComponent {
	@Output()
	stateLike: EventEmitter<LikeStateEnum> = new EventEmitter<LikeStateEnum>();

	@Output()
	close: EventEmitter<any> = new EventEmitter<any>();

	protected readonly LikeStateEnum = LikeStateEnum;

	protected choiceLike(type: LikeStateEnum) {
		this.stateLike.emit(type);
	}

	closePopup() {
		this.close.emit();
	}
}
