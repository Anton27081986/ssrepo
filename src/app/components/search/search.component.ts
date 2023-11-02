import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    title: any;
    searchInput!: FormGroup;

    constructor(private readonly formBuilder: FormBuilder) {}

    ngOnInit() {
        this.searchInput = this.formBuilder.group({
            search: [''],
        });
    }

    // convenience getter for easy access to form fields
    get query() {
        return this.searchInput.controls;
    }

    search() {}

    onSubmit() {}
}
