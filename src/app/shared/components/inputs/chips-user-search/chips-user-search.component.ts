import {ChangeDetectorRef, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { map } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
	selector: 'ss-chips-user-search',
	templateUrl: './chips-user-search.component.html',
	styleUrls: ['./chips-user-search.component.scss'],
})
export class ChipsUserSearchComponent {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = 'Введите ФИО';
	@Input() public error: string | undefined;
	@Input() public selectedUsers: any[] = [];

	@ViewChild('input') public input!: ElementRef;

	protected foundUsers: any[] = [];
	public constructor(
		private readonly changeDetectorRef: ChangeDetectorRef, private readonly usersApiService: UsersApiService) {}

	protected onInputChange(value: string) {
		if (value.length > 2) {
			this.usersApiService
				.getUsersByFIO(value)
				.pipe(
					map(({ items }) => items),
					untilDestroyed(this),
				)
				.subscribe(res => {
					if (this.selectedUsers?.length) {
						const selectedIds = this.selectedUsers.map(user => user.id);

						this.foundUsers = res.filter(
							(user: { id: any }) => !selectedIds.includes(user.id),
						);

					} else {
						this.foundUsers = res;
					}
					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.foundUsers = [];
			this.changeDetectorRef.detectChanges();
		}
	}

	protected onAddUserToList(user: any) {
		this.selectedUsers.push(user);
		this.foundUsers = [];
		setTimeout(() => {
			this.input.nativeElement.value = '';
			this.input.nativeElement.focus();
		}, 0);
	}

	protected onRemoveUserFromList(user: any, i: any) {
		this.selectedUsers.splice(i, 1);
	}

	protected dontSend(event: any): any {
		const key = event.which || event.keyCode;

		if (key === 13) {
			return false;
		}
	}
}
