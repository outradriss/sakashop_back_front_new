import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environnement.prod';

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonServiceService {


  private baseUrl = `${environment.apiUrl}/api/bl`;

  constructor(private http: HttpClient) {}

  envoyerBL(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
  getAllBL(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
  updateBL(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }
  deleteBL(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }  
}
