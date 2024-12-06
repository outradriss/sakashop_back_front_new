import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories, Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8090/api/gestion-product'; 

  constructor(private http: HttpClient) {}

 /**
   * Récupère tous les produits depuis le backend.
   * Cette méthode est utilisée pour stocker les produits en cache côté front.
   * @returns Observable<Product[]>
   */
 getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/list`);
}

  saveProduct(product: Product): Observable<Product> {

    return this.http.post<Product>(`${this.apiUrl}/save`, product);
  }
  
  saveCategory(category: Categories): Observable<Categories> {
    return this.http.post<Categories>(`${this.apiUrl}/save/category`, category);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  
  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  addCategory(category: String): Observable<Categories> {
    return this.http.post<Categories>(this.apiUrl, category);
  }
  

}
