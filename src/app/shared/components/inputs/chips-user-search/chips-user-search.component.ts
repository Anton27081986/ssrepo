import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { map } from 'rxjs';

@Component({
	selector: 'ss-chips-user-search',
	templateUrl: './chips-user-search.component.html',
	styleUrls: ['./chips-user-search.component.scss'],
})
export class ChipsUserSearchComponent {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public error: string | undefined;
	@Input() public selectedUsers: any[] = [];

	@ViewChild('input') public input!: ElementRef;

	protected foundUsers: any[] = [];
	constructor(private readonly usersApiService: UsersApiService) {}

	protected onInputChange(value: string) {
		if (value.length > 2) {
			this.usersApiService
				.getUsersByFIO(value)
				.pipe(map(({ items }) => items))
				.subscribe(res => {
					if (this.selectedUsers.length) {
						const selectedIds = this.selectedUsers.map(user => user.id);

						this.foundUsers = res.filter(
							(user: { id: any }) => !selectedIds.includes(user.id),
						);
					} else {
						this.foundUsers = res;
					}
				});
		} else {
			this.foundUsers = [];
		}
	}

	protected onAddUserToList(user: any) {
		this.selectedUsers.push(user);
		this.foundUsers = this.foundUsers.filter(foundUser => foundUser.id !== user.id);
		setTimeout(() => {
			this.input.nativeElement.value = '';
			this.input.nativeElement.focus();
		}, 0);
	}

	protected onRemoveUserFromList(user: any) {
		this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
		this.foundUsers.unshift(user);
	}

	protected dontSend(event: any): any {
		const key = event.which || event.keyCode;

		if (key == 13) {
			return false;
		}
	}
}
