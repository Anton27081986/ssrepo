import { Routes } from '@angular/router';
import { ContractorCardComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card.component';
import { ContractorCardBasicComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-basic/contractor-card-basic.component';
import { ContractorCardContractsComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-contracts/contractor-card-contracts.component';
import { ContractorCardContactsComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-contacts/contractor-card-contacts.component';
import { ContractorCardThanksComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-thanks/contractor-card-thanks.component';
import { ContractorCardDocsComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-docs/contractor-card-docs.component';
import { ContractorCardModelComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-model/contractor-card-model.component';
import { ContractorCardCorrespondenceComponent } from '@app/pages/contractors-dictionary/contractor-card/contractor-card-correspondence/contractor-card-correspondence.component';

export const CONTRACTOR_CARD_ROUTES: Routes = [
	{
		path: ':id',
		component: ContractorCardComponent,
		children: [
			{
				path: 'basic',
				component: ContractorCardBasicComponent,
				title: 'Общая информация',
			},
			{
				path: 'contracts',
				component: ContractorCardContractsComponent,
				title: 'Договоры и счета',
			},
			{
				path: 'contacts',
				component: ContractorCardContactsComponent,
				title: 'Контакты',
			},
			{
				path: 'thanks',
				component: ContractorCardThanksComponent,
				title: 'Благодарности',
			},
			{
				path: 'docs',
				component: ContractorCardDocsComponent,
				title: 'Документы',
			},
			{
				path: 'model',
				component: ContractorCardModelComponent,
				title: 'Модель клиента',
			},
			{
				path: 'model',
				component: ContractorCardModelComponent,
				title: 'Модель клиента',
			},
			{
				path: 'correspondence',
				component: ContractorCardCorrespondenceComponent,
				title: 'Переписка',
			},
			{
				path: '**',
				redirectTo: 'basic',
			},
		],
	},
];
