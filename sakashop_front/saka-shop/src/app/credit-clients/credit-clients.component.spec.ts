import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditClientsComponent } from './credit-clients.component';

describe('CreditClientsComponent', () => {
  let component: CreditClientsComponent;
  let fixture: ComponentFixture<CreditClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
