import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:8090/api/factures';

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer la facture au backend
  envoyerFacture(factureData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factureData);
  }
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/All`);
  }
  getFactureById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/facture/${id}`);
  }  
  supprimerFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  updateFacture(factureData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${factureData.id}`, factureData);
  }
  getClientsFromFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }
  
  
}
