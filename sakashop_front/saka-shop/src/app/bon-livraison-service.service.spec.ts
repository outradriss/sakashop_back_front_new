import { TestBed } from '@angular/core/testing';

import { BonLivraisonServiceService } from './bon-livraison-service.service';

describe('BonLivraisonServiceService', () => {
  let service: BonLivraisonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonLivraisonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
