import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subscription, tap } from 'rxjs';

export class TreeNode {
	public parent: IDictionaryItemDto;

	public children: IDictionaryItemDto[];
	public expanded = false;

	public subscription: Subscription = new Subscription();

	public indeterminate: WritableSignal<boolean> = signal(false);

	public controlCheckOrClearAll: FormControl<boolean | null> =
		new FormControl<boolean | null>(false);

	public readonly controls: {
		[id: string]: FormControl<boolean | null>;
	} = {};

	constructor(
		parent: IDictionaryItemDto,
		child: IDictionaryItemDto[],
		controlsMap: {
			[id: string]: FormControl<boolean | null>;
		}
	) {
		this.parent = parent;
		this.children = child;
		this.controls = controlsMap;

		this.children.forEach((item) => {
			if (this.controls[item.id].value) {
				this.expanded = true;
			}

			this.subscription.add(
				this.controls[item.id].valueChanges
					.pipe(debounceTime(50))
					.subscribe(() => {
						this.calcIndeterminate();
					})
			);
		});

		this.subscription.add(
			this.controlCheckOrClearAll.valueChanges
				.pipe(
					tap((value) => {
						this.children.forEach((item) => {
							if (this.indeterminate()) {
								this.controls[item.id].setValue(false);
							} else {
								this.controls[item.id].setValue(value);
							}
						});
					})
				)
				.subscribe()
		);

		this.calcIndeterminate();
	}

	public getTotalControlsCount(): number {
		return Object.keys(this.controls).length;
	}

	public getTrueControlsCount(): number {
		return Object.values(this.controls).filter(
			(control) => control.value === true
		).length;
	}

	private calcIndeterminate(): void {
		const totalCount = this.getTotalControlsCount();
		const trueCount = this.getTrueControlsCount();
		console.log(totalCount, trueCount);
		if (trueCount === 0) {
			this.indeterminate.set(false);
			this.controlCheckOrClearAll.setValue(false, { emitEvent: false });

			return;
		}

		if (trueCount === totalCount) {
			this.indeterminate.set(false);
			this.controlCheckOrClearAll.setValue(true, { emitEvent: false });

			return;
		}

		this.indeterminate.set(true);
		this.controlCheckOrClearAll.setValue(false, { emitEvent: false });
	}
}
