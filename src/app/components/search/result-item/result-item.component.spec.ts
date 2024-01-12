import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResultItemComponent} from './result-item.component';

describe('ResultItemComponent', () => {
    let component: ResultItemComponent;
    let fixture: ComponentFixture<ResultItemComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResultItemComponent],
        });
        fixture = TestBed.createComponent(ResultItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
