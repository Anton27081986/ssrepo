import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {Observable} from 'rxjs';
import {ApiService} from '@app/core/services/api.service';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    title!: string;
    currencyList!: Observable<any>;

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
        this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
        this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
        this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
        this.iconService.addIconLiteral('ss:like', AppIcons.like);
        this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
        this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
        this.iconService.addIconLiteral('ss:medal', AppIcons.medal);
        this.iconService.addIconLiteral('ss:openOut', AppIcons.openOut);
        this.iconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
        this.iconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
        this.iconService.addIconLiteral('ss:iconClose', AppIcons.iconClose);
        this.iconService.addIconLiteral('ss:attach', AppIcons.attach);
        this.iconService.addIconLiteral('ss:triangleBottom', AppIcons.triangleBottom);
        this.iconService.addIconLiteral('ss:triangleTop', AppIcons.triangleTop);
    }

    submitted = false;
    isConfirmLoading = false;

    ngOnInit() {
        this.currencyList = this.apiService.getCurrency();
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

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
    }
}
