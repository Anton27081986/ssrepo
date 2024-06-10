export const Permissions = {
	CLIENT_MANAGERS_CAN_ADD_MANAGERS: 'Client.Managers.Add',
	CLIENT_MANAGERS_CAN_REMOVE_MANAGERS: 'Client.Managers.Remove',
	CLIENT_MANAGERS_CAN_APPOINT_BASE_MANAGER: 'Client.Managers.AppointMainManager',
	CLIENT_MAIN_INFO_EDIT: 'Client.MainInfo.Edit',
	CLIENT_MAIN_INFO_PRICE_LIST: 'Client.MainInfo.PriceListLevel',
	CLIENT_MAIN_INFO_CALCULATION_DISTRIBUTORS: 'Client.MainInfo.СalculatingDistributors',
	CLIENT_ADDITIONAL_INFO_READ: 'Client.AdditionalInfo.Read',
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];
