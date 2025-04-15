import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environnement.prod';

@Injectable({
  providedIn: 'root'
})
export class AddCaisseService {
  private apiUrl = `${environment.apiUrl}/api`;; 

  constructor(private http: HttpClient) {}

  addCaisse(caisse: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-caisse`, caisse);
  }
  getCaisses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`); // Endpoint pour récupérer toutes les caisses
  }
  deleteCaisse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/caisses/${id}`);
  }
  
}
