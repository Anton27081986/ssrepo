import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-auction-sales',
    templateUrl: './auction-sales.component.html',
    styleUrls: ['./auction-sales.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionSalesComponent implements OnInit {
    public auctions!: Observable<any>;

    constructor(private readonly apiService: ApiService) {}

    ngOnInit(): any {
        this.auctions = this.apiService.getAuctions().pipe(map(({items}) => items));
    }
}
