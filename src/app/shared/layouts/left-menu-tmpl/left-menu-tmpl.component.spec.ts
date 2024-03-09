import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuTmplComponent } from './left-menu-tmpl.component';

describe('LeftMenuTmplComponent', () => {
	let component: LeftMenuTmplComponent;
	let fixture: ComponentFixture<LeftMenuTmplComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [LeftMenuTmplComponent],
		});
		fixture = TestBed.createComponent(LeftMenuTmplComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
