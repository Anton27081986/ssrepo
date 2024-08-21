import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UsersApiService } from '@app/core/api/users-api.service';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { ThanksColleagueApiService } from '@app/core/api/thanks-colleague-api.service';

@UntilDestroy()
@Component({
	selector: 'app-thanks-colleague',
	templateUrl: './thanks-colleague.component.html',
	styleUrls: ['./thanks-colleague.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksColleagueComponent implements OnInit {
	public date: any;
	public isModalVisible = false;
	public thankColleagueForm!: FormGroup;
	public loading = false;
	public submitted = false;
	public isConfirmLoading = false;
	public thankColleagueList!: Observable<any>;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public currentUserId: any;
	public getExtendedMode!: boolean;

	private readonly modelChanged: Subject<string> = new Subject<string>();

	public listOfOption: Array<{ name: string; id: string }> = [];

	public nzFilterOption = (): boolean => true;
	public total!: number;

	public constructor(
		private readonly apiService: UsersApiService,
		private readonly formBuilder: FormBuilder,
		public modalCreateService: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly cdr: ChangeDetectorRef,
		private readonly userProfileStore: UserProfileStoreService,
		private readonly winsApiService: WinsApiService,
		private readonly thanksColleaguesApi: ThanksColleagueApiService,
	) {}

	public ngOnInit() {}
}
