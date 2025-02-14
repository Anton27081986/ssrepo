export interface ICommentHistoryTableItem {
	author: { text: string | null; pseudoLink: string } | string;
	date: string;
	comment: string;
}
