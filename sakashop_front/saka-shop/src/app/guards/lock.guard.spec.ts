import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { lockGuard } from './lock.guard';

describe('lockGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => lockGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
