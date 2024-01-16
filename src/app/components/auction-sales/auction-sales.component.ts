import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';
import {ActivatedRoute} from '@angular/router';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
    selector: 'app-auction-sales',
    templateUrl: './auction-sales.component.html',
    styleUrls: ['./auction-sales.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AuctionSalesComponent implements OnInit {
    public auctions!: Observable<any>;
    public auctionAll!: Observable<any>;
    // public pageIndex= 0;
    pageIndex = 1;
    pageSize = 6;
    public total = 1;
    public listAuction: any;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService,
    ) {
        this.route.queryParams.subscribe(value => console.log('route', value));
    }

    loadDataFromServer(pageIndex: number, pageSize: number): void {
        this.apiService.getAuctions(pageIndex, pageSize).subscribe(data => {
            this.total = 33; // mock the total data here
            this.listAuction = data;
        });
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const {pageSize, pageIndex} = params;

        this.loadDataFromServer(pageIndex, pageSize);
    }

    ngOnInit(): any {
        this.loadDataFromServer(this.pageIndex, this.pageSize);
    }
}
