import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { map } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { formatDate } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { BirthdaysApiService } from '@app/core/api/birthdays-api.service';
import { IDayDto } from '@app/core/models/auth/day-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-birthday',
	templateUrl: './birthday.component.html',
	styleUrls: ['./birthday.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent implements OnInit {
	@ViewChild(NzCarouselComponent, { static: false }) myCarousel: NzCarouselComponent | undefined;

	protected date = new Date();
	protected birthdays: IDayDto[] = [];
	protected selectedTabIndex = 1;
	public customOptions!: OwlOptions;

	public constructor(
		private readonly apiService: BirthdaysApiService,
		public modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly cd: ChangeDetectorRef,
	) {}

	public ngOnInit(): any {
		this.onChange(this.date);

		this.customOptions = {
			loop: true,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			navSpeed: 700,
			dots: false,
			items: 4,
			navText: ['', ''],
			autoWidth: true,
			lazyLoad: true,
			responsive: {
				0: {
					items: 1,
				},
				400: {
					items: 1,
				},
				740: {
					items: 3,
				},
				940: {
					items: 4,
				},
			},
			nav: true,
		};

		this.changeOptions();
	}

	public onChange(result: Date): void {
		this.date = result;

		// TODO : make unsubscribe
		this.apiService
			.getBirthday(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
			.pipe(
				map(({ days }) => days),
				untilDestroyed(this),
			)
			.subscribe(birthdays => {
				this.birthdays = birthdays || [];
				this.selectTabByDay(this.date.toLocaleDateString());
				this.cd.markForCheck();
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
			.afterClose.pipe(untilDestroyed(this))
			.subscribe();
	}

	public selectTabByDay(date: string) {
		this.selectedTabIndex = this.birthdays.findIndex(x => x.name === date);
	}

	public onTabClick(date: string | null | undefined) {
		if (!date) {
			console.log('Нет даты');

			return;
		}

		const dateFormat = date.split('.');

		this.date = new Date([dateFormat[1], dateFormat[0], dateFormat[2]].join('/'));
	}

	public changeOptions() {
		this.customOptions.responsive = {};
	}
}
