import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartyVictoryComponent} from './party-victory.component';

describe('PartyVictoryComponent', () => {
    let component: PartyVictoryComponent;
    let fixture: ComponentFixture<PartyVictoryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PartyVictoryComponent],
        });
        fixture = TestBed.createComponent(PartyVictoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
