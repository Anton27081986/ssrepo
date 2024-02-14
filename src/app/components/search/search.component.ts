import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
	public title!: string;
	public searchResult!: Observable<any>;

	public showWindowResult = false;
	private readonly modelChanged: Subject<string> = new Subject<string>();
	private readonly resultSearch: any;

	public constructor(private readonly apiService: ApiService) {}

	public ngOnInit() {
		this.modelChanged.pipe().subscribe(nextValue => {
			if (nextValue.length >= 3) {
				this.searchResult = this.apiService
					.search(nextValue)
					.pipe(map(({ items }) => items));
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
}
