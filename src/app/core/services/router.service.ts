import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum AppRoutes {
	MainPage = '',
	ExcessIncome = 'excess-income-page',
	ClientCard = 'client-card',
}

export enum GlobalQueryParams {
	ClientId = 'clientId',
}

const toApp = [`/${AppRoutes.MainPage}`];
const toExcessIncome = [`/${AppRoutes.ExcessIncome}`];
const toClientCard = [`/${AppRoutes.ClientCard}`];

export const routes = {
	index: toApp,
	clientCard: {
		index: toClientCard,
		toDetail: (id: number) => [...toClientCard, id],
	},
};

@Injectable({
	providedIn: 'root',
})
export class RouterService {
	constructor(private readonly _router: Router) {}

	public toRedirectUrl(redirectUrl: string): Promise<boolean> {
		// Ставим где то на верху в authService  и по параметру редирект на нужную страницу
		const tree = this._router.parseUrl(redirectUrl);

		if (tree.queryParams.hasOwnProperty(GlobalQueryParams.ClientId)) {
			const id = tree.queryParams[GlobalQueryParams.ClientId];

			return this.toClientCard(id).then();
		}

		return this._router.navigateByUrl(redirectUrl);
	}

	public toClientCard(clientId: number): Promise<boolean> {
		return this._router.navigate(routes.clientCard.toDetail(clientId));
	}
}
