import {ChangeDetectionStrategy, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';
import {NzModalService} from 'ng-zorro-antd/modal';
// import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
    selector: 'app-thank-colleague',
    templateUrl: './thank-colleague.component.html',
    styleUrls: ['./thank-colleague.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankColleagueComponent implements OnInit {
    date: any;
    isVisible = false;
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    isConfirmLoading = false;

    public thankColleagueList!: Observable<any>;

    pageSize = 6;
    pageIndex = 1;

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
    ) {}

    ngOnInit() {
        this.thankColleagueList = this.apiService
            .getThanksColleague()
            .pipe(map(({items}) => items));

        this.loginForm = this.formBuilder.group({
            login: [
                '',
                [
                    Validators.required,
                    // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
        });
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    // Модальное окно комментариев
    showModalComments(item: any): void {
        console.log('спасибо коллеге', item);

        this.modalCreate
            .create({
                nzClosable: false,
                nzFooter: null,
                nzTitle: 'Спасибо коллеге',
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: CommentsModalComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                },
            })
            .afterClose.subscribe();
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
    }

    // destroyModal(): void {
    //     this.modal.destroy();
    // }
}
