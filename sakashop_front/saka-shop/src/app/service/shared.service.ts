import { Injectable } from '@angular/core';


import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private reloadProductsSubject = new Subject<void>();
  private reloadCaisseSubject = new Subject<void>();

  reloadProducts$ = this.reloadProductsSubject.asObservable();
  reloadCaisse$ = this.reloadCaisseSubject.asObservable();

  notifyReloadProducts(): void {
    this.reloadProductsSubject.next();
  }

  notifyReloadCaisse(): void {
    this.reloadCaisseSubject.next();
  }
}
