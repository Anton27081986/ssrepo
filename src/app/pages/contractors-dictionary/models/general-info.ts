import { IManager } from '@app/pages/contractors-dictionary/models/manager';
import { IClient } from '@app/pages/contractors-dictionary/models/client';

export interface IGeneralInfo {
	client: IClient;
	group: string;
	category: string;
	subIndustry: string | null;
	country: string;
	creditStatus: string;
	managers: IManager[];
	isStop: boolean | null;
}
