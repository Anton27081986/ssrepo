import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCardBirthdaysComponent } from './client-card-birthdays.component';

describe('ClientCardBirthdaysComponent', () => {
  let component: ClientCardBirthdaysComponent;
  let fixture: ComponentFixture<ClientCardBirthdaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientCardBirthdaysComponent]
    });
    fixture = TestBed.createComponent(ClientCardBirthdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
