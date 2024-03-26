import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-client-card',
	templateUrl: './client-card.component.html',
	styleUrls: ['./client-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardComponent implements OnInit {
	public clientId: string | null = null;
	// send clientId to widgets, they must control data

	public constructor(private readonly router: ActivatedRoute) {}

	public ngOnInit() {
		this.clientId = this.router.snapshot.paramMap.get('id');
	}
}
