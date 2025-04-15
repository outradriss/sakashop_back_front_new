import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credit } from '../models/Credit.model';
import { environment } from '../../environnement.prod';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = `${environment.apiUrl}/api/credit-client`;
  

  constructor(private http : HttpClient) { }

  getAllInCredit(): Observable<Product []> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }
  postCredit(credit: Credit): Observable<any> {
    return this.http.post<Credit>(`${this.apiUrl}/save`, credit).pipe(
      catchError((error) => {
        const errorMessage = error.error?.message ||'Impossible d enregistrerles les crédits .';
        console.error(`Erreur lors d'enregistrer les credits `, errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  };

    updateCredit(credit: Credit): Observable<Credit> {
    const url = `${this.apiUrl}/update/${credit.id}`;
    return this.http.put<Credit>(url, credit).pipe(
      catchError((error) => {
        const errorMessage = error.error?.message || 'Impossible de mettre à jour le crédit.';
        console.error(`Erreur lors de la mise à jour du crédit avec ID ${credit.id}:`, errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  payCredit(creditId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/credits/${creditId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du crédit :', error);
        return throwError(() => new Error('Impossible de supprimer le crédit.'));
      })
    );
  }

  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/list`);
  }
  deleteCredit(id: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${id}`; // URL de l'API pour supprimer le crédit
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la suppression du crédit avec ID ${id}:`, error);
        return throwError(() => new Error('Impossible de supprimer le crédit.'));
      })
    );
  }
  

   
}
