import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://localhost:8090/api/history'; 

  constructor(private http : HttpClient) { }

  getProductHistory(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}`);
  }
  getSalesData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ALL`);
  }
  getSalesDataToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ALLToDay`);
  }
}
