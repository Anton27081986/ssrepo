import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SuperLikeComponent} from './super-like.component';

describe('SuperLikeComponent', () => {
    let component: SuperLikeComponent;
    let fixture: ComponentFixture<SuperLikeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SuperLikeComponent],
        });
        fixture = TestBed.createComponent(SuperLikeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
