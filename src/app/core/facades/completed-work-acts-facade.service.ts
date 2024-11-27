import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CompletedWorkActsApiService } from '@app/core/api/completed-work-acts-api.service';
import { BehaviorSubject, forkJoin, Observable, Subject, switchMap, tap } from 'rxjs';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { IAddSpecification } from '@app/core/models/completed-work-acts/add-specification';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { IFile } from '@app/core/models/files/file';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsFacadeService {
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly filters: Subject<ICompletedActsFilter> = new Subject<ICompletedActsFilter>();

	private readonly acts = new BehaviorSubject<IResponse<ICompletedWorkAct>>({} as IResponse<any>);
	public acts$ = this.acts.asObservable();

	private readonly act = new BehaviorSubject<ICompletedWorkAct | null>(null);
	public act$ = this.act.asObservable();

	private readonly actAttachment = new BehaviorSubject<IFile[]>([]);
	public actAttachment$ = this.actAttachment.asObservable();

	private readonly actStates = new BehaviorSubject<IDictionaryItemDto[] | null>(null);
	public actStates$ = this.actStates.asObservable();

	private readonly specifications = new BehaviorSubject<ICompletedWorkActSpecification[]>([]);
	public specifications$ = this.specifications.asObservable();

	private readonly currencies = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public currencies$ = this.currencies.asObservable();

	private readonly buUnits = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public buUnits$ = this.buUnits.asObservable();

	private readonly contracts = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public contracts$ = this.contracts.asObservable();

	private readonly specificationsTotalAmount = new BehaviorSubject<number | null>(null);
	public specificationsTotalAmount$ = this.specificationsTotalAmount.asObservable();

	private readonly isEditMode = new BehaviorSubject<boolean>(false);
	public isEditMode$ = this.isEditMode.asObservable();

	public constructor(
		private readonly actsApiService: CompletedWorkActsApiService,
		private readonly filesApiService: FilesApiService,
		private readonly noticeService: NotificationToastService,
		private readonly searchFacade: SearchFacadeService,
	) {
		this.filters
			.pipe(
				switchMap(filters => {
					return this.actsApiService.getWorkActsList(filters);
				}),
				tap(acts => {
					this.acts.next(acts);
					this.isLoader$.next(false);
				}),
				untilDestroyed(this),
			)
			.subscribe();

		this.getActStates();
		this.getCurrencies();
		this.getBuUnits();
	}

	public applyFilters(filters: ICompletedActsFilter) {
		this.isLoader$.next(true);
		this.filters.next(filters);
	}

	public getAct(id: string) {
		this.actsApiService
			.getWorkAct(id)
			.pipe(
				switchMap(act => {
					this.act.next(act);
					this.actAttachment.next(act.documents);
					this.getContracts(act.providerContractor?.id)
						.pipe(untilDestroyed(this))
						.subscribe();

					return this.actsApiService.getSpecifications(id);
				}),
				tap(specifications => {
					this.specifications.next(specifications.items);
					this.specificationsTotalAmount.next(specifications.totalAmount);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public updateAct(body: IUpdateAct) {
		const addFiles = this.actAttachment.value.reduce<Array<Observable<string>>>((add, file) => {
			const onAct = this.act.value?.documents.find(doc => doc.id === file.id);

			if (!onAct) {
				add.push(this.addFileToAct(this.act.value!.id, file.id));
			}

			return add;
		}, []);

		const removeFiles =
			this.act.value?.documents.reduce<Array<Observable<string>>>((remove, file) => {
				const onAct = this.actAttachment.value?.find(doc => doc.id === file.id);

				if (!onAct) {
					remove.push(this.removeFileFromAct(this.act.value!.id, file.id));
				}

				return remove;
			}, []) || [];

		forkJoin([
			...addFiles,
			...removeFiles,
			this.actsApiService.updateAct(this.act.value!.id, body),
		])
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.switchMode(true);
			});
	}

	public addSpecificationToAct(body: IAddSpecification) {
		return this.actsApiService.addSpecification(this.act.value!.id, body).pipe(
			untilDestroyed(this),
			tap(() => {
				this.getAct(this.act.value!.id.toString());
			}),
		);
	}

	public updateSpecification(body: IAddSpecification) {
		return this.actsApiService.updateSpecification(this.act.value!.id, body).pipe(
			untilDestroyed(this),
			tap(() => {
				this.getAct(this.act.value!.id.toString());
			}),
		);
	}

	public deleteSpecification(specId: number) {
		this.actsApiService
			.deleteSpecification(this.act.value!.id, specId)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.getAct(this.act.value!.id.toString());
			});
	}

	public getActStates() {
		this.actsApiService
			.getActStates()
			.pipe(
				tap(states => {
					this.actStates.next(states.items);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getCurrencies() {
		this.actsApiService
			.getCurrencies()
			.pipe(
				tap(states => {
					this.currencies.next(states.items);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getBuUnits() {
		this.actsApiService
			.getBuUnits()
			.pipe(
				tap(states => {
					this.buUnits.next(states.items);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getContracts(id?: number) {
		return this.searchFacade.getDictionaryCompletedActContracts(id).pipe(
			tap(res => {
				this.contracts.next(res.items);
			}),
			untilDestroyed(this),
		);
	}

	public toArchiveAct() {
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

	public pullAct() {
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

	public restoreAct() {
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

	public switchMode(reload: boolean = false) {
		if (reload && this.act.value?.id) {
			this.getAct(this.act.value?.id.toString());
		}

		this.isEditMode.next(!this.isEditMode.value);
	}

	public uploadFile(file: File) {
		if (this.act.value) {
			const id = this.act.value.id;

			this.filesApiService
				.uploadFile(FileBucketsEnum.Attachments, file)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					this.actAttachment.next([...this.actAttachment.value, res]);
				});
		}
	}

	public deleteFile(id: string) {
		this.actAttachment.next(this.actAttachment.value.filter(file => file.id !== id));
	}

	public addFileToAct(actId: number, fileId: string) {
		return this.actsApiService.addDocumentToAct(actId, fileId);
	}

	public removeFileFromAct(actId: number, fileId: string) {
		return this.actsApiService.removeDocumentFromAct(actId, fileId);
	}
}
