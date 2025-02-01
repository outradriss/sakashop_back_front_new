import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCaisseComponent } from './open-caisse.component';

describe('OpenCaisseComponent', () => {
  let component: OpenCaisseComponent;
  let fixture: ComponentFixture<OpenCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenCaisseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
