import { Component, OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-turnover',
  templateUrl: './turnover.component.html',
  styleUrls: ['./turnover.component.css'],
  standalone:false
})
export class TurnoverComponent implements OnInit {
	
 // KPI (indicateurs clés)
 kpi = {
    todayRevenue: 12345.67,
    periodRevenue: 98765.43,
    averageDailyRevenue: 4567.89,
    topDay: new Date(),
  };

  // Filtres
  filters = {
    startDate: new Date(),
    endDate: new Date(),
  };

  // Transactions pour le tableau
  transactions = [
    { date: new Date(), product: 'Produit 1', category: 'Catégorie A', amount: 500 },
    { date: new Date(), product: 'Produit 2', category: 'Catégorie B', amount: 1200 },
    { date: new Date(), product: 'Produit 3', category: 'Catégorie A', amount: 800 },
  ];

  displayedColumns: string[] = ['date', 'product', 'category', 'amount'];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadTrendChart();
  }

  // Charger le graphique des tendances
  loadTrendChart(): void {
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [
          {
            label: 'Chiffre d\'Affaires',
            data: [10000, 15000, 20000, 25000, 30000, 35000],
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            fill: true,
          },
        ],
      },
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    console.log('Filtres appliqués :', this.filters);
    // Implémentez la logique de filtrage ici
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filters.startDate = new Date();
    this.filters.endDate = new Date();
    console.log('Filtres réinitialisés');
  }
  
  ngOninit():void{

  }

}