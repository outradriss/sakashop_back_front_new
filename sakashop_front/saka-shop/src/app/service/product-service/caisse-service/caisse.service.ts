import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CaisseService {
  private apiUrl = 'http://localhost:8090/api/caisse';

  constructor(private http:HttpClient) { }

  getAllInCaisse(): Observable<Product []> {
    return this.http.get<Product[]>(`${this.apiUrl}/list`);
  }
  saveOrders(orders: any[]): Observable<any> {
    // Ajoutez { responseType: 'text' } pour traiter les réponses textuelles
    return this.http.post(`${this.apiUrl}/saveOrder`, orders, { responseType: 'text' });
  }
  
  
  
}