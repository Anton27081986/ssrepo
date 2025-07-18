export interface ISendComment {
	note: string;
}

export interface ICommentsItemDto {
	id: number;
	note: string;
	author: ICommentsAuthorDto;
	createdDate: string;
	createdDateObj?: Date;
}

export interface ICommentsAuthorDto {
	id: number;
	name: string;
	position: string;
	avatarUrl: string;
}
