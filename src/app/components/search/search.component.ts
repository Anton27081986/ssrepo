import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
    public urlSearchResult: string = 'https://cisp.ssnab.ru/Search/Result?q=';
    searchResult!: Observable<string>;

    showWindowResult = false;
    private readonly modelChanged: Subject<string> = new Subject<string>();

    constructor(private readonly apiService: ApiService) {}

    ngOnInit() {
        this.modelChanged.pipe().subscribe(nextValue => {
            if (nextValue.length >= 3) {
                this.searchResult = this.apiService.search(nextValue).pipe(map(({items}) => items));
            }

            if (nextValue.length === 0) {
                this.searchResult = new Subject<string>();
            }
        });
    }

    @HostListener('document:click', ['$event'])
    onClick() {
        this.showWindowResult = false;
    }

    search($event: any) {
        this.showWindowResult = true;
        this.modelChanged.next($event.target.value);
    }

    goSearchResult($event: any) {
        window.open(`${this.urlSearchResult + $event.target.value}`, '_blank');
    }
}
