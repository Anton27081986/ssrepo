import {ChangeDetectionStrategy, Component, ElementRef, HostListener} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, map, Observable, Subject} from 'rxjs';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    title: any;
    searchInput!: FormGroup;
    public searchResult!: Observable<any>;

    showWindowResult = false;
    private readonly modelChanged: Subject<string> = new Subject<string>();

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly resultSearch: ElementRef,
    ) {}

    ngOnInit() {
        this.searchInput = this.formBuilder.group({
            search: [''],
        });

        // debounceTime(100)
        this.modelChanged.pipe(debounceTime(300)).subscribe(nextValue => {
            this.searchResult = this.apiService.getUsersByFIO(nextValue).pipe(
                debounceTime(300),
                map(({items}) => items),
            );
        });
    }

    // convenience getter for easy access to form fields
    get query() {
        return this.searchInput.controls;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        if (this.showWindowResult) {
            if (!this.resultSearch.nativeElement.contains(event.target)) {
                this.showWindowResult = false;
            }
        }
    }

    search($event: any) {
        $event.stopPropagation();
        this.showWindowResult = true;
        this.modelChanged.next($event.target.value);
    }

    onSubmit() {}
}
