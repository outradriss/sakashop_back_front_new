import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonServiceService {


  private baseUrl = 'http://localhost:8090/api/bonLivraison';

  constructor(private http: HttpClient) {}

  envoyerBL(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
  getAllBL(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
  
}
