export const Permissions = {
	CLIENT_MANAGERS_CAN_ADD_MANAGERS: 'Client.Managers.Add',
	CLIENT_MANAGERS_CAN_REMOVE_MANAGERS: 'Client.Managers.Remove',
	CLIENT_MANAGERS_CAN_APPOINT_BASE_MANAGER:
		'Client.Managers.AppointMainManager',
	CLIENT_MAIN_INFO_EDIT: 'Client.MainInfo.Edit',
	CLIENT_MAIN_INFO_PRICE_LIST: 'Client.MainInfo.PriceListLevel',
	CLIENT_MAIN_INFO_CALCULATION_DISTRIBUTORS:
		'Client.MainInfo.СalculatingDistributors',
	CLIENT_ADDITIONAL_INFO_READ: 'Client.AdditionalInfo.Read',
	CLIENT_TPR_URL_READ: 'Client.Proposals.Read',
	CLIENT_PROPOSALS_ADDITIONAL_INFO_READ:
		'Client.Proposals.AdditionalInfo.Read',
	CLIENT_PROCUREMENTS_URL_READ: 'Contract.Read',
	CLIENT_PROCUREMENTS_ADD: 'Contract.Add',
	CLIENT_PROCUREMENTS_EDIT: 'Contract.Edit',
	CLIENT_PROPOSALS_CAN_DOWNLOADREPORTS:
		'Client.Proposals.CantDownloadReports',
	CLIENT_PROPOSALS_CAN_TAKE_IN_WORK: 'Client.Proposals.CanTakeInWork',
	COMPLETED_WORK_ACTS: 'CompletedWorkAct',
	COMPLETED_WORK_ACTS_ACCESS: 'CompletedWorkAct.Access',
	COMPLETED_WORK_ACTS_EDIT: 'CompletedWorkAct.Edit',
	COMPLETED_WORK_ACTS_EDIT_ACT_APPLICANT: 'CompletedWorkAct.EditActApplicant',
	COMPLETED_WORK_ACTS_EDIT_ACT_PROVIDER: 'CompletedWorkAct.EditActProvider',
	COMPLETED_WORK_ACTS_EDIT_ACT_CURRENCY: 'CompletedWorkAct.EditActCurrency',
	COMPLETED_WORK_ACTS_EDIT_ACT_DATE_UPLOAD:
		'CompletedWorkAct.EditActDateUpload',
	COMPLETED_WORK_ACTS_EDIT_ACT_COMMENT: 'CompletedWorkAct.EditActComment',
	COMPLETED_WORK_ACTS_EDIT_ACT_BU_UNIT: 'CompletedWorkAct.EditActBuUnit',
	COMPLETED_WORK_ACTS_EDIT_DOCUMENT: 'CompletedWorkAct.EditDocument',
	COMPLETED_WORK_ACTS_PULL_ACT: 'CompletedWorkAct.PullAct',
	COMPLETED_WORK_ACTS_DELETE: 'CompletedWorkAct.Delete',
	COMPLETED_WORK_ACTS_RESTORE: 'CompletedWorkAct.Restore',
	COMPLETED_WORK_ACTS_SEND_TO_APPLICANT: 'CompletedWorkAct.SendToApplicant',
	COMPLETED_WORK_ACTS_PRINT_REPORT: 'CompletedWorkAct.PrintReport',
	COMPLETED_WORK_ACTS_RETURN_BACK_TO_APPLICANT:
		'CompletedWorkAct.ReturnBackToApplicant',
	COMPLETED_WORK_ACTS_SEND_TO_ADMINISTRATOR:
		'CompletedWorkAct.SendToAdministrator',

	EXCESS_INCOME_READ: 'Snd.Read',
	EXCESS_INCOME_EDIT: 'Snd.Edit',
	EXCESS_INCOME_EDIT_COMMENT: 'Snd.EditComment',
	OPERATIONAL_PLAN_ACCESS: 'OperationalPlan.Access',
	OPERATIONAL_PLAN_ADMIN: 'OperationalPlan.Admin',
	OPERATIONAL_PLAN_EDIT: 'OperationalPlan.Edit',
	OPERATIONAL_PLAN_VIEW_ORDER: 'OperationalPlan.ViewOrder',
	OPERATIONAL_PLAN_APPROVE_MATERIALS: 'OperationalPlan.ApproveMaterials',
	OPERATIONAL_PLAN_CALC_ROW_MATERIALS: 'OperationalPlan.CalcRowMaterials',
	OPERATIONAL_PLAN_ADD_COMMENTS: 'OperationalPlan.AddComments',
	OPERATIONAL_PLAN_UPLOAD_ONE_S: 'OperationalPlan.UploadOneS',
	OPERATIONAL_PLAN_UPLOAD_WMS: 'OperationalPlan.UploadWMS',
	OPERATIONAL_PLAN_ORDER_PRODUCTION: 'OperationalPlan.OrderProduction',
	PERSONIFICATION_ORDER_AUTHOR_VIEW_DATA:
		'Personification.OrderAuthorViewData',
	PERSONIFICATION_ORDER_AUTHOR_CREATE: 'Personification.OrderAuthorViewData',
	PERSONIFICATION_ORDER_AUTHOR_DELETE: 'Personification.OrderAuthorDelete',
	PERSONIFICATION_ORDER_AUTHOR_APPROVE: 'Personification.OrderAuthorApprove',
	PERSONIFICATION_ORDER_AUTHOR_REJECT: 'Personification.OrderAuthorReject',
	PERSONIFICATION_MUTMZ_VIEW_DATA: 'Personification.MutmzViewData',

	PERSONIFICATION_MUTMZ_APPROVE_SUPPLY_ORDER:
		'Personification.MutmzApproveSupplyOrder',

	PERSONIFICATION_MUTMZ_REJECT_SUPPLY_ORDER:
		'Personification.MutmzRejectSupplyOrder',

	PERSONIFICATION_MUTMZ_PLACE_SUPPLY_ORDER_IN_PRODUCTION:
		'Personification.MutmzPlaceSupplyOrderInProduction',

	PERSONIFICATION_MUTMZ_CHANGE_SUPPLY_DATE:
		'Personification.MutmzChangeSupplyDate',

	PERSONIFICATION_MUTMZ_DELETE_SUPPLY_ORDER:
		'Personification.MutmzChangeSupplyOrder',

	PERSONIFICATION_MUTMZ_REJECT_SUPPLY_ORDER_DELETION:
		'Personification.MutmzRejectSupplyOrderDeletion',

	PERSONIFICATION_MUTMZ_IMPERSONATE_ANOTHER_EMPLOYEE:
		'Personification.MutmzImpersonateAnotherEmployee',

	PERSONIFICATION_MUTMZ_CONFIRM_SUPPLY_ORDER_DELETION:
		'Personification.MutmzConfirmSupplyOrderDeletion',

	PERSONIFICATION_MUTMZ_CLARIFY: 'Personification.MutmzClarify',

	PERSONIFICATION_MUTMZ_CHANGE_QUANTITY: 'Personification.ChangeQuantity',
	PERSONIFICATION_MUTMZ_CHANGE_QUEUE_ORDER: 'Personification.MutmzChangeQueueOrder',
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];
