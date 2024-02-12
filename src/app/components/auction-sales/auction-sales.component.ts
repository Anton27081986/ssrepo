import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {ApiService} from '@app/core/services/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-auction-sales',
    templateUrl: './auction-sales.component.html',
    styleUrls: ['./auction-sales.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionSalesComponent implements OnInit {
    public auctionAll!: Observable<any>;
    public pageIndex = 1;
    public pageSize = 6;
    public total!: number;
    public listAuction!: Observable<any>;
    public offset = 0;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService,
        private readonly cd: ChangeDetectorRef,
    ) {
        this.route.queryParams.subscribe();
    }

    public ngOnInit(): any {
        this.loadDataFromServer(this.pageSize, this.offset);
    }

    // Не верные параметры
    public loadDataFromServer(pageSize: number, offset: number): void {
        this.listAuction = this.apiService.getAuctions(pageSize, offset).pipe(
            tap(value => {
                this.total = value.total + this.pageSize; // TODO Поправить, в пагинации нужен еще один сдвиг в конце
            }),
        );
    }

    public nzPageIndexChange($event: number) {
        if ($event === 1) {
            this.offset = 0;
        } else {
            this.offset = this.pageSize * $event - this.pageSize;
        }

        this.offset = this.pageSize * $event - this.pageSize;

        this.pageIndex = $event; // Установка текущего индекса

        this.updateAuctionList(this.pageSize, this.offset);
    }

    public updateAuctionList(pageSize: number, offset: number): void {
        this.listAuction = this.apiService.getAuctions(pageSize, offset);
    }
}
