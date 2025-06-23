import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, tap } from 'rxjs';

export class TreeNodeFilter {
	public parent: IDictionaryItemDto;

	public children: IDictionaryItemDto[];
	public expanded: boolean = false;

	public subscription: Subscription = new Subscription();

	public indeterminate: WritableSignal<boolean> = signal(false);

	public controlCheckAll: FormControl<boolean | null> = new FormControl<
		boolean | null
	>(false);

	public readonly controls: {
		[id: string]: FormControl<boolean | null>;
	} = {};

	constructor(
		parent: IDictionaryItemDto,
		items: IDictionaryItemDto[],
		controlsMap: {
			[id: string]: FormControl<boolean | null>;
		},
	) {
		this.parent = parent;
		this.children = items.filter(
			(item: IDictionaryItemDto) => parent.id === item.parentId,
		);

		this.children.forEach((item) => {
			this.controls[item.id] = controlsMap[item.id];
			if (this.controls[item.id].value) {
				this.expanded = true;
			}
			this.subscription.add(
				this.controls[item.id].valueChanges.subscribe(() => {
					this.calcIndeterminate();
				}),
			);
		});

		this.subscription.add(
			this.controlCheckAll.valueChanges
				.pipe(
					tap((value) => {
						this.children.forEach((item) => {
							this.controls[item.id].setValue(value);
						});
					}),
				)
				.subscribe(),
		);

		this.calcIndeterminate();
	}

	public getTotalControlsCount(): number {
		return Object.keys(this.controls).length;
	}

	public getTrueControlsCount(): number {
		return Object.values(this.controls).filter(
			(control) => control.value === true,
		).length;
	}

	private calcIndeterminate(): void {
		const totalCount = this.getTotalControlsCount();
		const trueCount = this.getTrueControlsCount();

		if (trueCount === 0) {
			this.indeterminate.set(false);
			this.controlCheckAll.setValue(false, { emitEvent: false });

			return;
		}

		if (trueCount === totalCount) {
			this.indeterminate.set(false);
			this.controlCheckAll.setValue(true, { emitEvent: false });

			return;
		}

		this.indeterminate.set(true);
		this.controlCheckAll.setValue(false, { emitEvent: false });
	}
}
