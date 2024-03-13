import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendErrorMessagesComponent } from './backend-error-messages.component';

describe('BackendErrorMessagesComponent', () => {
	let component: BackendErrorMessagesComponent;
	let fixture: ComponentFixture<BackendErrorMessagesComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [BackendErrorMessagesComponent],
		});
		fixture = TestBed.createComponent(BackendErrorMessagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
