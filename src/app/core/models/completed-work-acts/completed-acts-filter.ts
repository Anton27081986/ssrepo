export interface ICompletedActsFilter {
	DateFrom?: string | null;
	DateTo?: string | null;
	UploadDateFrom?: string | null;
	UploadDateTo?: string | null;
	Id?: number;
	BuUnitId?: number;
	ProviderContractorId?: number;
	ApplicantUserId?: number;
	State?: number[];
	TotalAmount?: string;
	WithArchive: boolean | null;
	Additional: number | null;
}
