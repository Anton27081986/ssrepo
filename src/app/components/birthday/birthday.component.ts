import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { map } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { formatDate } from '@angular/common';
import { IBirthday } from '@app/core/models/birthday';

@Component({
	selector: 'app-birthday',
	templateUrl: './birthday.component.html',
	styleUrls: ['./birthday.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent implements OnInit {
	@ViewChild(NzCarouselComponent, { static: false }) myCarousel: NzCarouselComponent | undefined;

	protected date = new Date();
	protected birthdays: IBirthday[] = [];
	protected selectedTabIndex = 1;

	constructor(
		private readonly apiService: ApiService,
		public modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly ref: ChangeDetectorRef,
	) {}

	public ngOnInit(): any {
		this.onChange(this.date);
	}

	public onChange(result: Date): void {
		this.date = result;

		// TODO : make unsubscribe
		this.apiService
			.getBirthday(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
			.pipe(map(({ days }) => days))
			.subscribe(birthdays => {
				this.birthdays = birthdays;
				this.selectTabByDay(this.date.toLocaleDateString());
				this.ref.markForCheck();
			});
	}

	public showModalOpenOut(item: any): void {
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
					data: item,
				},
			})
			.afterClose.subscribe();
	}

	public selectTabByDay(date: string) {
		this.selectedTabIndex = this.birthdays.findIndex(x => x.name === date);
	}

	public onTabClick(date: string) {
		const dateFormat = date.split('.');

		this.date = new Date([dateFormat[1], dateFormat[0], dateFormat[2]].join('/'));
	}
}
