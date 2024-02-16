import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AppIcons } from '@app/core/icons';
import { ApiService } from '@app/core/services/api.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class FooterComponent implements OnInit {
	protected readonly AppRoutes = AppRoutes;
	listIcon!: any;

	constructor(
		private readonly apiService: ApiService,
		private readonly iconService: NzIconService,
	) {
		this.iconService.addIconLiteral('ss:mail', AppIcons.mail);
	}

	ngOnInit(): any {
		this.apiService.getSocialLink().subscribe(item => {
			this.listIcon = item.items;
		});
	}
}
