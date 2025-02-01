import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { LockService } from '../lock.service';
@Injectable({
  providedIn: 'root',
})
export class LockGuard implements CanActivate {
  constructor(private lockService: LockService, private router: Router) {}

  canActivate(): boolean {
    if (this.lockService.isLocked()) {
      // Si la caisse est verrouillée, redirige vers l'écran de déverrouillage
      this.router.navigate(['/caisse']); // Redirection vers le composant caisse
      return false;
    }
    return true; // Permet la navigation si la caisse n'est pas verrouillée
  }
}