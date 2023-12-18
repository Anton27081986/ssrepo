import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

interface IPerson {
    key: string;
    name: string;
    availability: string;
    price: string;
    amount: string;
}

@Component({
    selector: 'app-auction-sales',
    templateUrl: './auction-sales.component.html',
    styleUrls: ['./auction-sales.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionSalesComponent implements OnInit {
    listOfData: IPerson[] = [
        {
            key: '1',
            name: 'Комплексная пищевая добавка Денфос 82ST (25м)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '2',
            name: 'Геллановая камедь пищевая добавка Е418',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Эфир крахмала и натриевой соли октенилянтарной кислоты',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Гелеон SC 2 (25м)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Дикрахмалфосфат оксипропилированный (HYDROXYPROPYL DISTARC...',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
        {
            key: '3',
            name: 'Пищевая добавка - Эритритол (Erithritol) (Е968)',
            availability: 'На складе',
            price: '4,23',
            amount: '19 840',
        },
    ];

    public auctions!: Observable<any>;

    constructor(private readonly apiService: ApiService) {}

    ngOnInit(): any {
        this.apiService.getAuctions().subscribe(console.log);
    }
}
