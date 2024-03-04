import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { SearchApiService } from '@app/core/api/search-api.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
	public title!: string;
	public searchResult!: Observable<string>;
	public urlSearchResult: string = 'https://cisp.ssnab.ru/Search/Result?q=';

	public showWindowResult = false;
	private readonly modelChanged: Subject<string> = new Subject<string>();
	private readonly resultSearch: any;

	public constructor(private readonly apiService: SearchApiService) {}

	public ngOnInit() {
		this.modelChanged.pipe().subscribe(nextValue => {
			if (nextValue.length >= 3) {
				this.searchResult = this.apiService
					.search(nextValue)
					.pipe(map(({ items }) => items));
			}

			if (nextValue.length === 0) {
				this.searchResult = new Subject<string>();
			}
		});
	}

	@HostListener('document:click', ['$event'])
	// Подправить
	public onClick(event: Event) {
		this.showWindowResult = false;

		if (this.showWindowResult) {
			if (!this.resultSearch.nativeElement.contains(event.target)) {
				this.showWindowResult = false;
			}
		}
	}

	public search($event: any) {
		this.showWindowResult = true;
		this.modelChanged.next($event.target.value);
	}

	public goSearchResult($event: any) {
		window.open(`${this.urlSearchResult + $event.target.value}`, '_blank');
	}
}
