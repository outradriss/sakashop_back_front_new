import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {
  private apiUrl = 'http://localhost:8090/api/users/register';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Email existe déjà!';
    if (error.error && error.error.error) {
      errorMessage = error.error.error; // Récupère le message d'erreur du backend
    }
    return throwError(() => new Error(errorMessage));
  }
}
