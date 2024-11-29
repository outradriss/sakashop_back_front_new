import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Vérifie si le token est présent
    if (!token) {
      this.router.navigate(['/login']); // Redirige si l'utilisateur n'est pas authentifié
      return false;
    }
    return true; // Autorise l'accès si le token est présent
  }
}
