import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-backend-error-messages',
	templateUrl: './backend-error-messages.component.html',
	styleUrls: ['./backend-error-messages.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackendErrorMessagesComponent implements OnInit {
	@Input() backendErrors: any;

	errorMessages!: string[];

	ngOnInit(): void {
		this.errorMessages = Object.keys(this.backendErrors).map((name: string) => {
			const messages = this.backendErrors[name].join(' ');

			return `${name} ${messages}`;
		});
	}
}
