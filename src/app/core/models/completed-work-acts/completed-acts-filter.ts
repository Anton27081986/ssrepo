export interface ICompletedActsFilter {
	DateFrom?: string;
	DateTo?: string;
	UploadDateFrom?: string;
	UploadDateTo?: string;
	Id?: number;
	BuUnitId?: number;
	ProviderContractorId?: number;
	ApplicantUserId?: number;
	State?: number[];
	TotalAmount?: number;
	WithArchive: boolean | null;
	Additional: number | null;
}
