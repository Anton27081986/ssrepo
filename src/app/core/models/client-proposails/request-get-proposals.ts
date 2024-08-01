export interface IRequestGetProposals {
	clientId: number;
	limit: number;
	offset: number;
	withArchiver?: boolean;
}
