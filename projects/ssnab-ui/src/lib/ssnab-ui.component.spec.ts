import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SsnabUiComponent} from './ssnab-ui.component';

describe('SsnabUiComponent', () => {
    let component: SsnabUiComponent;
    let fixture: ComponentFixture<SsnabUiComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SsnabUiComponent],
        });
        fixture = TestBed.createComponent(SsnabUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
