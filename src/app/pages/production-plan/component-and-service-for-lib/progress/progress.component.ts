import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	InputSignal,
	Signal,
} from '@angular/core';

/**
 * Компонент индикатора прогресса с различными состояниями
 *
 * <ss-lib-progress></ss-lib-progress>
 * ```
 */
@Component({
	selector: 'ss-lib-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss'],
	imports: [],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
	public readonly total: InputSignal<number> = input.required<number>();
	public readonly current: InputSignal<number> = input.required<number>();
	public progress: Signal<number> = computed(() => {
		return (this.current() * 100) / this.total();
	});
}
