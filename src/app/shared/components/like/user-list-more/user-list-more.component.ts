import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-user-list-more',
	templateUrl: './user-list-more.component.html',
	styleUrls: ['./user-list-more.component.scss'],
})
export class UserListMoreComponent implements OnInit, OnChanges {
	@Input() users: IUserDto[] = [];
	@Input() count: number = 0;
	public readonly viewCount: number = 5;
	public remainder: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	ngOnInit() {
		if (this.count > this.viewCount) {
			this.remainder.next(this.count - this.viewCount);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.count) {
			this.ngOnInit();
		}
	}
}
