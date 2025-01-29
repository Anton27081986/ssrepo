import { InputIconTypeEnum } from '@app/shared/components/inputs/input-v2/models/input-icon-type';

export interface IInputIcon {
	type: InputIconTypeEnum;
	iconName: string;
	action: () => void;
	visible: boolean;
}
