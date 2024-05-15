import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-client-card-new-products',
	templateUrl: './client-card-new-products.component.html',
	styleUrls: ['./client-card-new-products.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardNewProductsComponent {}
