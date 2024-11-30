import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories, Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8090/api/products'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/list`);
  }
  saveProduct(product: Product): Observable<Product> {
    debugger
    return this.http.post<Product>(`${this.apiUrl}/save`, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    debugger
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  addCategory(category: String): Observable<Categories> {
    return this.http.post<Categories>(this.apiUrl, category);
  }
  

}
