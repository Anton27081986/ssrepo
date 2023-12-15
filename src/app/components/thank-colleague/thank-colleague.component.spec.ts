import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankColleagueComponent } from './thank-colleague.component';

describe('ThankColleagueComponent', () => {
  let component: ThankColleagueComponent;
  let fixture: ComponentFixture<ThankColleagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThankColleagueComponent]
    });
    fixture = TestBed.createComponent(ThankColleagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
