import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environnement.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/api/users/authenticate`;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getMyCaisse(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/users/my-caisse`);
  }
  
  
}
