import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HistoryService } from '../service/product-service/history-service/history.service';

@Component({
  selector: 'app-history',
  standalone: false,
  
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  productId!: number; // ID du produit
  productHistory: any[] = []; // Stocke les données retournées par le backend

  constructor(private router : Router , private route : ActivatedRoute , private historyservice : HistoryService){}
  ngOnInit(): void {
    // Récupérer l'ID du produit depuis l'URL
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadHistory(this.productId); // Charger les données
      }
    });
  }

  loadHistory(productId: number): void {
    this.historyservice.getProductHistory(productId).subscribe(
      (data) => {
        this.productHistory = data;
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'historique :', error);
      }
    );
  }


  calculateRemainingQuantity(): number {
    return this.productHistory.reduce((total : any, product:any) => total + product.stockQuantity, 0);
  }
  
  calculateSoldQuantity(): number {
    return this.productHistory.reduce((total:any, product:any) => total + product.orderedQuantity, 0);
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }


  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
}
