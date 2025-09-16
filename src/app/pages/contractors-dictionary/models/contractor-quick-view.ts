import { IOfficialInfo } from '@app/pages/contractors-dictionary/models/official-info';
import { IGeneralInfo } from '@app/pages/contractors-dictionary/models/general-info';
import { IAdditionalInfo } from '@app/pages/contractors-dictionary/models/additional-info';

export interface ContractorQuickView {
	officialInfo: IOfficialInfo;
	generalInfo: IGeneralInfo;
	additionalInfo: IAdditionalInfo;
}
