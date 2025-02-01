import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlushCaisseComponent } from './flush-caisse.component';

describe('FlushCaisseComponent', () => {
  let component: FlushCaisseComponent;
  let fixture: ComponentFixture<FlushCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlushCaisseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlushCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
