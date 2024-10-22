export const Permissions = {
	CLIENT_MANAGERS_CAN_ADD_MANAGERS: 'Client.Managers.Add',
	CLIENT_MANAGERS_CAN_REMOVE_MANAGERS: 'Client.Managers.Remove',
	CLIENT_MANAGERS_CAN_APPOINT_BASE_MANAGER: 'Client.Managers.AppointMainManager',
	CLIENT_MAIN_INFO_EDIT: 'Client.MainInfo.Edit',
	CLIENT_MAIN_INFO_PRICE_LIST: 'Client.MainInfo.PriceListLevel',
	CLIENT_MAIN_INFO_CALCULATION_DISTRIBUTORS: 'Client.MainInfo.СalculatingDistributors',
	CLIENT_ADDITIONAL_INFO_READ: 'Client.AdditionalInfo.Read',
	CLIENT_TPR_URL_READ: 'Client.Proposals.Read',
	CLIENT_PROPOSALS_ADDITIONAL_INFO_READ: 'Client.Proposals.AdditionalInfo.Read',
	CLIENT_PROCUREMENTS_URL_READ: 'Contract.Read',
	CLIENT_PROCUREMENTS_ADD: 'Contract.Add',
	CLIENT_PROCUREMENTS_EDIT: 'Contract.Edit',
	CLIENT_PROPOSALS_CAN_DOWNLOADREPORTS: 'Client.Proposals.CantDownloadReports',
	CLIENT_PROPOSALS_CAN_TAKE_IN_WORK: 'Client.Proposals.CanTakeInWork',
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];
