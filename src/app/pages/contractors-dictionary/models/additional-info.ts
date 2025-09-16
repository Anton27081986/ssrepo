import { IFile } from '@app/pages/contractors-dictionary/models/file';

export interface IAdditionalInfo {
	receiverAddress: string;
	productionAddress: string;
	complexDesignSample: IFile;
	designNuances: string;
	correspondenceAddress: string;
	edo: string;
	isBlacklisted: boolean;
	requiresCertificateAnalysis: boolean;
	certificatesAnalysis: IFile[];
	notes: string;
	tradingPlatforms: string[];
	totalEmployees: number;
	employeesByClient: number;
	email: string;
	website: string;
	fax: string;
	phone: string;
}
