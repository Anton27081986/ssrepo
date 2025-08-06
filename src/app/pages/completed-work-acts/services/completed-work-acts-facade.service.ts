import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, switchMap, tap } from 'rxjs';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { IAddSpecification } from '@app/core/models/completed-work-acts/add-specification';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
import {
	FileBucketsEnum,
	FilesApiService,
} from '@app/core/api/files.api.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IFile } from '@app/core/models/files/file';
import { catchError } from 'rxjs/operators';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';
import { Router } from '@angular/router';
import { Pagination } from '@app/core/models/production-plan/operation-plan';
import { CompletedWorkActsApiService } from '@app/pages/completed-work-acts/services/completed-work-acts-api.service';
import { IFilterOption } from '@app/shared/components/filters/filters.component';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsFacadeService {
	public linkToInstruction =
		'https://erp.ssnab.ru/api/static/general/2025/08/05/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F._%D0%A0%D0%B5%D0%B5%D1%81%D1%82%D1%80_%D0%B0%D0%BA%D1%82%D0%BE%D0%B2_%D0%B2%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%BD%D1%8B%D1%85_%D1%80%D0%B0%D0%B1%D0%BE%D1%82_07.08.25_e2c97bc9-ec2d-45aa-9e89-e601ef097829.docx';

	public filterValueStore$: BehaviorSubject<
		(ICompletedActsFilter & Pagination) | null
	> = new BehaviorSubject<(ICompletedActsFilter & Pagination) | null>(null);

	private readonly act = new BehaviorSubject<ICompletedWorkAct | null>(null);
	public act$ = this.act.asObservable();

	readonly actAttachment = new BehaviorSubject<IFile[]>([]);
	public actAttachment$ = this.actAttachment.asObservable();

	private readonly actStates = new BehaviorSubject<
		IDictionaryItemDto[] | null
	>(null);

	public actStates$ = this.actStates.asObservable();

	private readonly specifications = new BehaviorSubject<
		ICompletedWorkActSpecification[]
	>([]);

	public specifications$ = this.specifications.asObservable();

	private readonly currencies = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public currencies$ = this.currencies.asObservable();

	private readonly buUnits = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public buUnits$ = this.buUnits.asObservable();

	private readonly contracts = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public contracts$ = this.contracts.asObservable();

	private readonly specificationsTotalAmount = new BehaviorSubject<
		number | null
	>(null);

	public specificationsTotalAmount$ =
		this.specificationsTotalAmount.asObservable();

	private readonly isEditMode = new BehaviorSubject<boolean>(false);
	public isEditMode$ = this.isEditMode.asObservable();

	private readonly permissions = new BehaviorSubject<string[]>([]);
	public permissions$ = this.permissions.asObservable();

	private readonly actPermissions = new BehaviorSubject<string[]>([]);
	public actPermissions$ = this.actPermissions.asObservable();

	readonly finDocs = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public finDocs$ = this.finDocs.asObservable();

	constructor(
		private readonly actsApiService: CompletedWorkActsApiService,
		private readonly filesApiService: FilesApiService,
		private readonly noticeService: NotificationToastService,
		private readonly searchFacade: SearchFacadeService,
		private readonly permissionsApiService: PermissionsApiService,
		private readonly notificationService: NotificationToastService,
		private readonly router: Router
	) {
		this.getActStates();
		this.getCurrencies();
		this.getBuUnits();
		this.getPermissions();
	}

	public getWorkActsList(
		request: ICompletedActsFilter & Pagination
	): Observable<IResponse<ICompletedWorkAct>> {
		return this.actsApiService.getWorkActsList(request);
	}

	public getAct(id: string): void {
		this.actsApiService
			.getWorkAct(id)
			.pipe(
				switchMap(({ data, permissions }) => {
					this.actPermissions.next(permissions);
					this.act.next(data);
					this.actAttachment.next(data.documents);

					if (
						!permissions.includes(
							Permissions.COMPLETED_WORK_ACTS_ACCESS
						)
					) {
						this.router
							.navigate(['completed-work-acts'])
							.then(() => {
								this.notificationService.addToast(
									`Доступ к акту ${id} ограничен`,
									'warning'
								);
							});

						return NEVER;
					}

					this.getContracts(data.providerContractor?.id)
						.pipe(untilDestroyed(this))
						.subscribe();

					return this.actsApiService.getSpecifications(id);
				}),
				tap<{
					totalAmount: number;
					items: ICompletedWorkActSpecification[];
				}>((specifications) => {
					this.specifications.next(
						specifications.items.map((item) => {
							return {
								...item,
								faObject: item.faObject
									? {
											...item.faObject,
											name: `${item.faObject?.name}, ${item.faAsset?.name || ''}`,
										}
									: undefined,
							} as ICompletedWorkActSpecification;
						})
					);
					this.specificationsTotalAmount.next(
						specifications.totalAmount
					);
				}),
				untilDestroyed(this),
				catchError((err: unknown) => {
					this.router.navigate([`completed-work-acts`]);
					throw err;
				})
			)
			.subscribe();
	}

	public updateAct(body: IUpdateAct): void {
		this.actsApiService
			.updateAct(this.act.value!.id, body)
			.pipe(untilDestroyed(this))
			.subscribe((act) => {
				this.switchMode(act);
				this.actAttachment.next(act.documents);
				this.actsApiService
					.getSpecifications(act.id.toString(10))
					.pipe(untilDestroyed(this))
					.subscribe((specifications) => {
						this.specifications.next(specifications.items);
						this.specificationsTotalAmount.next(
							specifications.totalAmount
						);
					});
			});
	}

	public addSpecificationToAct(
		body: IAddSpecification
	): Observable<ICompletedWorkActSpecification> {
		return this.actsApiService
			.addSpecification(this.act.value!.id, body)
			.pipe(
				untilDestroyed(this),
				tap(() => {
					this.getAct(this.act.value!.id.toString());
				})
			);
	}

	public updateSpecification(
		body: IAddSpecification
	): Observable<ICompletedWorkActSpecification> {
		return this.actsApiService
			.updateSpecification(this.act.value!.id, body)
			.pipe(
				untilDestroyed(this),
				tap(() => {
					this.getAct(this.act.value!.id.toString());
				})
			);
	}

	public deleteSpecification(specId: number): void {
		this.actsApiService
			.deleteSpecification(this.act.value!.id, specId)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.getAct(this.act.value!.id.toString());
			});
	}

	public getActStates(): void {
		this.actsApiService
			.getActStates()
			.pipe(
				tap((states) => {
					this.actStates.next(states.items);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public getCurrencies(): void {
		this.actsApiService
			.getCurrencies()
			.pipe(
				tap((states) => {
					this.currencies.next(states.items);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public getBuUnits(): void {
		this.actsApiService
			.getBuUnits()
			.pipe(
				tap((states) => {
					this.buUnits.next(states.items);
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public getContracts(
		id?: number
	): Observable<IResponse<IDictionaryItemDto>> {
		return this.searchFacade.getDictionaryCompletedActContracts(id).pipe(
			tap((res) => {
				this.contracts.next(res.items);
			}),
			untilDestroyed(this)
		);
	}

	public getFinDocs(
		providerContractorId: number | null,
		externalActDate: string | null
	): void {
		if (providerContractorId) {
			this.searchFacade
				.getFinDocOrders(providerContractorId, externalActDate)
				.pipe(
					tap((res) => {
						const docs = res.items.reduce(
							(
								previousValue: IFilterOption[],
								currentValue: IFilterOption
							) => {
								const nameArr = currentValue.name.split('|');
								const time = nameArr[2]
									.slice(0, -9)
									.trim()
									.split('/');

								nameArr[2] = ` ${[time[1], time[0], time[2]].join('.')} `;

								return [
									...previousValue,
									{
										...currentValue,
										name: nameArr.join('|'),
									},
								];
							},
							[]
						);

						this.finDocs.next(docs);
					}),
					untilDestroyed(this)
				)
				.subscribe();
		}
	}

	public toArchiveAct(): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.toArchiveAct(id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт отправлен в архив', 'ok');
				});
		}
	}

	public pullAct(): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.pullAct(id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт проведен', 'ok');
				});
		}
	}

	public restoreAct(): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.restoreAct(id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт восстановлен', 'ok');
				});
		}
	}

	public sendActToAdmin(): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.sendActToAdmin(id)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт отправлен', 'ok');
				});
		}
	}

	public sendActToApplicant(comment: string): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.sendActToApplicant(id, comment)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт отправлен', 'ok');
				});
		}
	}

	public returnActToApplicant(comment: string): void {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.returnActToApplicant(id, comment)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
					this.noticeService.addToast('Акт возвращен', 'ok');
				});
		}
	}

	public switchMode(act?: ICompletedWorkAct | null): void {
		if (act) {
			this.act.next(act);
		} else {
			this.getContracts(this.act?.value?.providerContractor?.id)
				.pipe(untilDestroyed(this))
				.subscribe();
		}

		this.isEditMode.next(!this.isEditMode.value);
	}

	public uploadFile(file: File): Observable<IFile> {
		return this.filesApiService.uploadFile(
			FileBucketsEnum.Attachments,
			file
		);
	}

	public deleteFile(id: string): void {
		this.actAttachment.next(
			this.actAttachment.value.filter((file) => file.id !== id)
		);
	}

	public addFileToAct(actId: number, fileId: string): Observable<string> {
		return this.actsApiService.addDocumentToAct(actId, fileId);
	}

	public getPermissions(): void {
		this.permissionsApiService
			.getPermissionClient(Permissions.COMPLETED_WORK_ACTS)
			.pipe(
				tap((res) => {
					if (res.items) {
						this.permissions.next(res.items);
					}
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public downloadReport(
		filter: (ICompletedActsFilter & Pagination) | null
	): Observable<Blob> {
		return this.actsApiService.downloadReport(filter);
	}
}
