import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaisseStockService {
  private cachedProducts: any[] = [];

  setCachedProducts(products: any[]): void {
    this.cachedProducts = products;
  }

  getCachedProducts(): any[] {
    return this.cachedProducts;
  }
}
