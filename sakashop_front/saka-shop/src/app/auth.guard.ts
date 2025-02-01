import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LockService } from './lock.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router , private lockService: LockService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Vérifie si le token est présent
    if (!token) {
      this.router.navigate(['/login']); // Redirige si l'utilisateur n'est pas authentifié
      return false;
    }
    return true; // Autorise l'accès si le token est présent
  }
  canActivateCaisse(): boolean {
    if (this.lockService.isLocked()) {
      // Redirige vers l'écran de déverrouillage si la caisse est verrouillée
      this.router.navigate(['/unlock']);
      return false;
    }
    return true;
  }
}
