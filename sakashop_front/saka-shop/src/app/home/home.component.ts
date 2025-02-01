import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

   // Liste des rotations et translations pour les spans
   rotations = Array.from({ length: 70 }, () => ({
    rotate: Math.floor(Math.random() * 360 - 40), // Rotation aléatoire entre -180 et 180 degrés
    translateX: Math.floor(Math.random() * 30 - 25), // Déplacement X aléatoire
    translateY: Math.floor(Math.random() * 50 - 25) // Déplacement Y aléatoire
  }));

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
