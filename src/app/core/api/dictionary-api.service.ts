import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponse } from '@app/core/utils/response';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@Injectable({
	providedIn: 'root',
})
export class DictionaryApiService {
	constructor(private readonly http: HttpClient) {}

	/** Список категорий клиентов */
	public getCategories(
		query?: string
	): Observable<IResponse<{ id: number; name: string }>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/company/dictionary/categories`,
			{
				params,
			}
		);
	}

	/** Список контрагентов */
	public getContractors(
		query?: string,
		clientId?: number | null
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (clientId !== null && clientId !== undefined) {
			params = params.set('clientId', clientId);
		}

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/contractors`,
			{
				params,
			}
		);
	}

	/** Список контрагентов из manufacturingApi */
	public getContractorsManufacturing(
		query?: string,
		clientId?: number | null
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (clientId !== null && clientId !== undefined) {
			params = params.set('clientId', clientId);
		}

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/Contractors`,
			{
				params,
			}
		);
	}

	/** Список плательщиков */
	public getPayerContractors(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/PayerContractors`,
			{
				params,
			}
		);
	}

	/** Список статусов */
	public getStatuses(): Observable<IResponse<{ id: number; name: string }>> {
		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/company/dictionary/clientStatuses`
		);
	}

	/** Список статусов учета законтрактованного сырья */
	public getProcurementsStatuses(): Observable<
		IResponse<{ id: number; name: string }>
	> {
		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/procurements/dictionary/contractStatuses`
		);
	}

	/** Список статусов персонификации */
	public getPersonificationStatuses(
		query?: string
	): Observable<IResponse<{ id: number; name: string }>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<{ id: number; name: string }>>(
			`${environment.apiUrl}/api/manufacturing/dictionary/personificationstatuses`,
			{ params }
		);
	}

	/** Список договоров учета законтрактованного сырья из КИСП*/
	public getProcurementsContractDetails(
		ContractorId: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (ContractorId !== null && ContractorId !== undefined) {
			params = params.set('ContractorId', ContractorId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/procurements/dictionary/contracts`,
			{ params }
		);
	}

	/** Список товаров */
	public getTovs(query?: string): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/tovs`,
			{ params }
		);
	}

	/** Список товаров из manufacturingApi */
	public getTovsManufacturing(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/manufacturing/Dictionary/tovs`,
			{ params }
		);
	}

	/** Список договоров */
	public getContracts(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/procurements/dictionary/contractDetails`,
			{ params }
		);
	}

	public getTechnologist(
		clientId: number,
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		if (clientId) {
			params = params.set('clientId', clientId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/technologists`,
			{ params }
		);
	}

	/** Список комментариев ТПР */
	public getTprRejectReasons(): Observable<IResponse<IDictionaryItemDto>> {
		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/tprRejectsReasons`
		);
	}

	public getDictionaryUsers(
		clientId: number,
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		if (clientId) {
			params = params.set('clientId', clientId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/users/search`,
			{ params }
		);
	}

	public getServices(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Services`,
			{ params }
		);
	}

	public getCostArticles(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/CostArticles`,
			{ params }
		);
	}

	public getFaObjects(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/FaObjects`,
			{ params }
		);
	}

	public getProjects(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Projects`,
			{ params }
		);
	}

	public getDepts(
		query?: string,
		userId?: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		if (userId) {
			params = params.set('userId', userId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Depts`,
			{ params }
		);
	}

	public getSections(
		query?: string,
		deptId?: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		if (deptId) {
			params = params.set('deptId', deptId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/MfsSections`,
			{ params }
		);
	}

	public getBuUnits(
		query?: string,
		applicantUserId?: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		if (applicantUserId) {
			params = params.set('ApplicantUserId', applicantUserId);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/BuUnits`,
			{ params }
		);
	}

	public getTovUnits(
		query?: string
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/TovUnits`,
			{ params }
		);
	}

	public getCompletedActContracts(
		id?: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (id) {
			params = params.set('providerContractorId', id);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/Contracts`,
			{ params }
		);
	}

	public getFinDocOrders(
		providerContractorId: number,
		externalActDate: string | null
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (providerContractorId) {
			params = params.set('providerContractorId', providerContractorId);
		}

		if (externalActDate) {
			params = params.set('externalActDate', externalActDate);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/dictionary/FinDocOrdersByProvider`,
			{ params }
		);
	}

	public getTovGroupsByClient(
		query: string,
		clientId: number
	): Observable<IResponse<IDictionaryItemDto>> {
		let params = new HttpParams();

		if (query) {
			params = params.set('query', query);
		}

		return this.http.get<IResponse<IDictionaryItemDto>>(
			`${environment.apiUrl}/api/company/Snd/clients/${clientId}/tovGroups`,
			{ params }
		);
	}
}
