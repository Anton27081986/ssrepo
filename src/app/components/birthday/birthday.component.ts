import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Signal,
	signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BirthdaysApiService } from '@app/core/api/birthdays-api.service';
import { IDayDto } from '@app/core/models/auth/day-dto';
import { ITab } from '@app/shared/components/tabs/tab';
import { IBirthdayUserDto } from '@app/core/models/auth/birthday-user-dto';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { BirthdayImports } from '@app/components/birthday/birthday.imports';
import {CardComponent} from "@app/shared/components/card/card.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TabsComponent} from "@app/shared/components/tabs/tabs.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {UserCardComponent} from "@app/components/user-card/user-card.component";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";

@Component({
	selector: 'app-birthday',
	templateUrl: './birthday.component.html',
	styleUrls: ['./birthday.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BirthdayImports, CardComponent, TextComponent, ButtonComponent, IconComponent, TabsComponent, SsDividerComponent, LoaderComponent, UserCardComponent, EmptyPlaceholderComponent, HeadlineComponent],
})
export class BirthdayComponent {
	private readonly birthdaysApiService = inject(BirthdaysApiService);

	public readonly dateBirthCtrl = new FormControl<string>(
		formatDate(new Date(), 'yyyy-MM-dd', 'ru-RU'),
		{
			nonNullable: true,
		},
	);

	public loading = signal(false);

	public birthDays: Signal<IDayDto[]> = toSignal(
		this.dateBirthCtrl.valueChanges.pipe(
			filter(Boolean),
			tap(() => this.loading.set(true)),
			switchMap(date =>
				this.birthdaysApiService.getBirthday(date).pipe(
					tap(birthdaysList => this.reminderLink.set(birthdaysList.reminderLink || '')),
					map(({ days }) => days || []),
					tap(() => this.loading.set(false)),
					catchError(() => {
						this.loading.set(false);

						return of([]);
					}),
				),
			),
		),
		{ initialValue: [] as IDayDto[] },
	);

	public reminderLink = signal('');
	public selectedTabName = signal('');

	public selectedTabContent = computed(() => {
		const users =
			this.birthDays().find(day => day.name === this.selectedTabName())?.items || [];

		return users.map(user => this.toIUserDto(user));
	});

	public constructor() {
		effect(
			() =>
				this.selectedTabName.set(this.birthDays().length ? this.birthDays()[0].name! : ''),
			{ allowSignalWrites: true },
		);
	}

	public addNotice(): void {
		window.open(this.reminderLink(), '_blank');
	}

	public selectTab(name: string): void {
		this.selectedTabName.set(name);
	}

	protected toTabsItemsFormat(birthDays: IDayDto[], shortYear: (date: string) => string): ITab[] {
		return birthDays.map(item => ({
			name: item.name,
			label: shortYear(item.name!),
			isVisible: true,
		})) as ITab[];
	}

	protected toITabFormat(name: string, shortYear: (date: string) => string): ITab {
		return {
			name,
			label: shortYear(name),
			isVisible: true,
		} as ITab;
	}

	protected shortYear(date: string): string {
		return `${date.slice(0, -4)} ${date.slice(-2)}`;
	}

	private toIUserDto(user: IBirthdayUserDto): IUserDto {
		return user as IUserDto;
	}
}
