import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { ApiService } from '@app/core/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
	protected readonly AppRoutes = AppRoutes;
	public listIcon!: any;

	public constructor(private readonly apiService: ApiService) {}

	public ngOnInit(): any {
		this.apiService
			.getSocialLink()
			.pipe(take(1), untilDestroyed(this))
			.subscribe(item => {
				this.listIcon = item.items;
			});
	}
}
