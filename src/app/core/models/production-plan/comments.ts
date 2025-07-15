export interface ISendComment {
	note: string;
}

export interface ICommentsItemDto {
	id: number;
	note: string;
	author: ICommentsAuthorDto;
	createdDate: string;
}

export interface ICommentsAuthorDto {
	id: number;
	name: string;
	position: string;
	avatarUrl: string;
}
