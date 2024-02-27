import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';

@Component({
	selector: 'app-currency',
	templateUrl: './currency.component.html',
	styleUrls: ['./currency.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent implements OnInit {
	public loginForm!: FormGroup;
	public loading = false;
	public title!: string;
	public currencyList!: Observable<any>;
	public submitted = false;
	public constructor(
		private readonly apiService: ApiService,
		private readonly formBuilder: FormBuilder,
	) {}

	public ngOnInit() {
		this.currencyList = this.apiService.getCurrency();
		this.loginForm = this.formBuilder.group({
			login: ['', [Validators.required]],
			password: ['', Validators.required],
		});
	}
}
