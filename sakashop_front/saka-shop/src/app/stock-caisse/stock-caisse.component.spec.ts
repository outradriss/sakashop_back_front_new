import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCaisseComponent } from './stock-caisse.component';

describe('StockCaisseComponent', () => {
  let component: StockCaisseComponent;
  let fixture: ComponentFixture<StockCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockCaisseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
