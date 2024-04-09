import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrendlyAccountsComponent } from './frendly-accounts.component';

describe('ManagerComponent', () => {
	let component: FrendlyAccountsComponent;
	let fixture: ComponentFixture<FrendlyAccountsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [FrendlyAccountsComponent],
		});
		fixture = TestBed.createComponent(FrendlyAccountsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
