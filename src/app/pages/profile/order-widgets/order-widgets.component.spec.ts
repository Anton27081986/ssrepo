import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderWidgetsComponent} from './order-widgets.component';

describe('OrderWidgetsComponent', () => {
    let component: OrderWidgetsComponent;
    let fixture: ComponentFixture<OrderWidgetsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrderWidgetsComponent],
        });
        fixture = TestBed.createComponent(OrderWidgetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
