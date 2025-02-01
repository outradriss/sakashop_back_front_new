import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVenteComponent } from './gestion-vente.component';

describe('GestionVenteComponent', () => {
  let component: GestionVenteComponent;
  let fixture: ComponentFixture<GestionVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
