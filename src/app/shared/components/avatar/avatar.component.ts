import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ss-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
	@Input() public src!: string;
	@Input() public isSquare = true;
	@Input() public size: 'xs' | 's' | 'm' | 'l' = 'xs';

	protected noImage = false;

	protected width: number = 32;
	protected height: number = 32;

	protected onImageError(e: any) {
		console.log('Ошибка', e);
		this.noImage = true;
	}

	public ngOnInit() {
		switch (this.size) {
			case 'l':
				this.width = this.isSquare ? 80 : 72;
				this.height = this.isSquare ? 80 : 96;

				return;
			case 'm':
				this.width = this.isSquare ? 58 : 58;
				this.height = this.isSquare ? 58 : 77;

				return;
			case 's':
				this.width = this.isSquare ? 40 : 44;
				this.height = this.isSquare ? 40 : 59;

				return;
			case 'xs':
				this.width = this.isSquare ? 32 : 28;
				this.height = this.isSquare ? 32 : 36;
		}
	}

	protected readonly event = event;
}
