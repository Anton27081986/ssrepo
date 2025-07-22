export interface ICompletedActsFilter {
	DateFrom?: string;
	DateTo?: string;
	Id?: number;
	BuUnitId?: number;
	ProviderContractorId?: number;
	ApplicantUserId?: number;
	State?: number[];
	TotalAmount?: number;
	WithArchive: boolean;
	Additional: number;
}
