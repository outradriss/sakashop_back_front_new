import { TestBed } from '@angular/core/testing';

import { AddCaisseService } from './add-caisse.service';

describe('AddCaisseService', () => {
  let service: AddCaisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCaisseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
