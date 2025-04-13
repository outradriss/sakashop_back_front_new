import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:8090/api/factures';

  constructor(private http: HttpClient) {}

  // ➕ Créer une facture
  envoyerFacture(factureData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, factureData);
  }

  // 📄 Toutes les factures
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // 🔍 Récupérer une facture par ID
  getFactureById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ❌ Supprimer une facture par ID
  supprimerFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ♻️ Mettre à jour une facture
  updateFacture(factureData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${factureData.id}`, factureData);
  }

  // 👥 Récupérer les clients avec leurs produits
  getClientsFromFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }
}
