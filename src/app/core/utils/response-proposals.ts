export interface AlterSearch {
	name: string;
	linkToDetail: string;
}

export interface ResponseProposals<T> {
	items: T[];
	total: number;
	isAlterFilter: boolean;
	alterFilterDefenitionNote?: string;
	alterSearch: AlterSearch[];
}
