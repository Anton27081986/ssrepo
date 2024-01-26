import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardVictoryComponent} from './card-victory.component';

describe('CardVictoryComponent', () => {
    let component: CardVictoryComponent;
    let fixture: ComponentFixture<CardVictoryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CardVictoryComponent],
        });
        fixture = TestBed.createComponent(CardVictoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
