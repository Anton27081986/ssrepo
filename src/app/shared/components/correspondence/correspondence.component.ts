import { Component, Input } from '@angular/core';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { IUserDto } from '@app/core/models/notifications/user-dto';

@Component({
	selector: 'ss-correspondence',
	templateUrl: './correspondence.component.html',
	styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent {
	@Input() public objectId!: number;

	protected selectedMessageToReply: { message: IMessageItemDto; toUsers: IUserDto[] } | undefined;

	public replyTo(event: { message: IMessageItemDto; toUsers: IUserDto[] }) {
		this.selectedMessageToReply = event;
	}
}
