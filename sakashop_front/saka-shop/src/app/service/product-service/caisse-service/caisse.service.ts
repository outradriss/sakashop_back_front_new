import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CaisseService {
  private apiUrl = 'http://localhost:8090/api/caisse';

  constructor(private http:HttpClient) { }

  getAllInCaisse(params?: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/list`, { params });
  }
  
  saveOrders(orders: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveOrder`, orders, { responseType: 'text' });
  }
  
  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("Erreur HTTP :", error);
        return of({ status: "error", message: "Commande introuvable." }); // ✅ Renvoie une réponse gérée
      })
    );
  }

  saveOrderChange(orderChangeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveOrderChange`, orderChangeData, { responseType: 'text' });
  }
  

  sendCancellationInfo(cancellationInfo: { reason: string; itemId: number[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel`, cancellationInfo);
  }
  
  verifyPassword(password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verify-password`, { password });
  }
  printSale(saleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/print`, { saleId });
  }
}
