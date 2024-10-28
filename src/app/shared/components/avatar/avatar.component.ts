import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'ss-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
	@Input() public src: string | null = null;
	@Input() public size: 'smallest' | 'small' | 'medium' | 'large' | 'big' = 'medium';
	@Input() public type: 'square' | 'rectangle' | 'round' = 'square';

	protected noImage = false;

	protected width: BehaviorSubject<string> = new BehaviorSubject<string>('36');
	protected height: BehaviorSubject<string> = new BehaviorSubject<string>('36');
	protected radius: BehaviorSubject<string> = new BehaviorSubject<string>('none');

	protected onImageError() {
		this.noImage = true;
	}

	public ngOnInit() {
		switch (this.size) {
			case 'smallest':
				if (this.type === 'square') {
					this.width.next('24');
					this.height.next('24');
				} else if (this.type === 'rectangle') {
					this.width.next('28');
					this.height.next('36');
				}

				return;
			case 'small':
				if (this.type === 'square') {
					this.width.next('36');
					this.height.next('36');
				} else if (this.type === 'rectangle') {
					this.width.next('28');
					this.height.next('36');
				} else {
					this.width.next('32');
					this.height.next('32');
					this.radius.next('50');
				}

				return;
			case 'medium':
				if (this.type === 'square') {
					this.width.next('40');
					this.height.next('40');
				} else if (this.type === 'rectangle') {
					this.width.next('44');
					this.height.next('59');
				}

				return;
			case 'large':
				if (this.type === 'square') {
					this.width.next('58');
					this.height.next('58');
				} else if (this.type === 'rectangle') {
					this.width.next('58');
					this.height.next('77');
				}

				return;
			case 'big':
				if (this.type === 'square') {
					this.width.next('80');
					this.height.next('80');
				} else if (this.type === 'rectangle') {
					this.width.next('72');
					this.height.next('96');
				}
		}
	}
}
