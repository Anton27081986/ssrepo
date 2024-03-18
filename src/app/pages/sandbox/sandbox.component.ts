import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sandbox',
	templateUrl: './sandbox.component.html',
	styleUrls: ['./sandbox.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent implements OnInit {
	public loading = false;

	public constructor() {}

	public ngOnInit() {}
}
