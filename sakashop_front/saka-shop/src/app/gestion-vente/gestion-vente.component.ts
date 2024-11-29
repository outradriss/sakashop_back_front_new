import { Component } from '@angular/core';
import { Router } from '@angular/router';

type SalesData = {
  products: {
    name: string;
    quantitySold: number;
    totalSales: number;
    margin: number;
  }[];
  totalSales: number;
  totalMargin: number;
};

@Component({
  selector: 'app-gestion-vente',
  templateUrl: './gestion-vente.component.html',
  styleUrls: ['./gestion-vente.component.css'],
  standalone:false
})
export class GestionVenteComponent {
  selectedDate: string = '';
  salesData: SalesData | null = null; // Utiliser le type explicite ici
  chartData: any[] = [];
  colorScheme = 'cool';
constructor(private router :Router){}
  // Simulation des données de vente
  mockSalesData: Record<string, SalesData> = {
    '2024-11-01': {
      products: [
        { name: 'Produit A', quantitySold: 30, totalSales: 200, margin: 50 },
        { name: 'Produit B', quantitySold: 20, totalSales: 150, margin: 40 },
        { name: 'Produit C', quantitySold: 10, totalSales: 100, margin: 25 }
      ],
      totalSales: 450,
      totalMargin: 115
    },
    '2024-11-02': {
      products: [
        { name: 'Produit D', quantitySold: 15, totalSales: 120, margin: 30 },
        { name: 'Produit E', quantitySold: 8, totalSales: 80, margin: 20 }
      ],
      totalSales: 200,
      totalMargin: 50
    }
  };

  // Récupère les données de vente pour la date sélectionnée
  fetchSalesData() {
    // Cast explicite pour que TypeScript comprenne que selectedDate correspond aux clés de mockSalesData
    this.salesData = this.mockSalesData[this.selectedDate as keyof typeof this.mockSalesData] || null;

    if (this.salesData) {
      this.chartData = this.salesData.products.map(product => ({
        name: product.name,
        value: product.quantitySold
      }));
    } else {
      this.chartData = [];
    }
  }
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
