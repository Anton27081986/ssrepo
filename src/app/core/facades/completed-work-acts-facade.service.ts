import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { CompletedWorkActsApiService } from '@app/core/api/completed-work-acts-api.service';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { IAddSpecification } from '@app/core/models/completed-work-acts/add-specification';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
import { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';

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

	private readonly actStates = new BehaviorSubject<IDictionaryItemDto[] | null>(null);
	public actStates$ = this.actStates.asObservable();

	private readonly specifications = new BehaviorSubject<ICompletedWorkActSpecification[]>([]);
	public specifications$ = this.specifications.asObservable();

	private readonly currencies = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public currencies$ = this.currencies.asObservable();

	private readonly buUnits = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public buUnits$ = this.buUnits.asObservable();

	private readonly specificationsTotalAmount = new BehaviorSubject<number | null>(null);
	public specificationsTotalAmount$ = this.specificationsTotalAmount.asObservable();

	private readonly isEditMode = new BehaviorSubject<boolean>(false);
	public isEditMode$ = this.isEditMode.asObservable();

	public constructor(
		private readonly actsApiService: CompletedWorkActsApiService,
		private readonly filesApiService: FilesApiService,
		private readonly noticeService: NotificationToastService,
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
		return this.actsApiService.updateAct(this.act.value!.id, body).pipe(
			untilDestroyed(this),
			tap(() => {
				this.getAct(this.act.value!.id.toString());
			}),
		);
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

	public switchMode() {
		this.isEditMode.next(!this.isEditMode.value);
	}

	public uploadFile(file: File) {
		if (this.act.value) {
			const id = this.act.value.id;

			this.filesApiService
				.uploadFile(FileBucketsEnum.Attachments, file)
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					this.addFileToAct(id.toString(), res.id);
				});
		}
	}

	public addFileToAct(actId: string, fileId: string) {
		this.actsApiService
			.addDocumentToAct(actId, fileId)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.getAct(actId);
			});
	}

	public removeFileFromAct(fileId: string) {
		if (this.act.value) {
			const id = this.act.value.id;

			this.actsApiService
				.removeDocumentFromAct(id.toString(), fileId)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.getAct(id.toString());
				});
		}
	}
}
