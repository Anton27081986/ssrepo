import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleLikeModalComponent } from './people-like-modal.component';

describe('PeopleLikeModalComponent', () => {
	let component: PeopleLikeModalComponent;
	let fixture: ComponentFixture<PeopleLikeModalComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [PeopleLikeModalComponent],
		});
		fixture = TestBed.createComponent(PeopleLikeModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
