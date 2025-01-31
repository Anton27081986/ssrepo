import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';
import {CommonModule, NgForOf} from "@angular/common";
import {RatingTeamTabComponent} from "@app/widgets/rating/rating-team-tab/rating-team-tab.component";

@UntilDestroy()
@Component({
	selector: 'ss-tabs-control',
	templateUrl: './tabs-control.component.html',
	styleUrls: ['./tabs-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TabsControlComponent),
			multi: true,
		},
	],
	imports: [
		CommonModule,
		RatingTeamTabComponent,
		NgForOf
	],
	standalone: true
})
export class TabsControlComponent implements ControlValueAccessor {
	public items = input.required<IRankTypeItemDto[]>();

	public target: IRankTypeItemDto | null = null;

	public rankTypeId = input.required<number>();

	private OnChange!: (value: IRankTypeItemDto) => void;
	private OnTouched!: (value: IRankTypeItemDto) => void;

	public writeValue(target: IRankTypeItemDto) {
		this.target = target;
	}

	public registerOnChange(fn: (value: IRankTypeItemDto) => void): void {
		this.OnChange = fn;
	}

	public changeTab(item: IRankTypeItemDto) {
		this.target = item;
		this.OnChange(item);
	}

	public registerOnTouched(fn: () => void): void {
		this.OnTouched = fn;
	}
}
