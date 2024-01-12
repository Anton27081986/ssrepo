import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddVictoryModalComponent} from './add-victory-modal.component';

describe('AddVictoryModalComponent', () => {
    let component: AddVictoryModalComponent;
    let fixture: ComponentFixture<AddVictoryModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddVictoryModalComponent],
        });
        fixture = TestBed.createComponent(AddVictoryModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
