export interface IStoreTableBase {
	id: string;
	readonly title: string;
	show: boolean;
	order: number;
	disableChange?: boolean; // can`t edit field... use for default field and checkboxes
}

export interface IStoreTableFilterElement extends IStoreTableBase {
	value: any;
}

export interface IStoreTableBaseColumn extends IStoreTableBase {
	/** @deprecated */
	readonly sort?: boolean | null;
	readonly sortType?: string | null;
	readonly width?: string | null;
	readonly align?: 'center' | null;
	readonly toolTip?: string | null;
	readonly columnsSplit?: IStoreTableBaseColumn[];
}
