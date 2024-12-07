import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gestion-vente',
  templateUrl: './gestion-vente.component.html',
  styleUrls: ['./gestion-vente.component.css'],
  standalone:false
})
export class GestionVenteComponent {
  sales: any[] = [];
  filteredSales: any[] = [];
  totalProducts: number = 0;
  totalBuyPrice: number = 0;
  totalSellPrice: number = 0;
  profitMarginAmount: number = 0;
  totalQuantity: number = 0;
  profitMarginPercentage: number = 0;

  // Date Range sélectionné
  dateRangeForm!: FormGroup;

  constructor(
    private router: Router,
    private salesService: HistoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadSalesData();

    // Initialisation correcte du FormGroup
    const today = new Date();
    this.dateRangeForm = this.fb.group({
      start: [today], // Contrôle pour la date de début
      end: [today],   // Contrôle pour la date de fin
    });
  }

  // Charger les données depuis le backend
  loadSalesData(): void {
    this.salesService.getSalesData().subscribe(
      (data) => {
        this.sales = data;

        // Filtrer les données par défaut pour `date_update = now()`
        const today = new Date();
        this.filteredSales = this.sales.filter((sale) => {
          const lastUpdated = new Date(sale.lastUpdated);
          return (
            lastUpdated.getDate() === today.getDate() &&
            lastUpdated.getMonth() === today.getMonth() &&
            lastUpdated.getFullYear() === today.getFullYear()
          );
        });

        // Calculer les totaux
        this.calculateTotals(this.filteredSales);
      },
      (error) => {
        console.error('Erreur lors du chargement des données :', error);
      }
    );
  }

  sortSalesByDate(): void {
    this.filteredSales.sort((a, b) => {
      const dateA = new Date(a.lastUpdated).getTime();
      const dateB = new Date(b.lastUpdated).getTime();
      return dateA - dateB; // Du plus ancien au plus récent
    });
  }
  
  // Appliquer les filtres de date
  applyDateFilter(): void {
    const { start, end } = this.dateRangeForm.value;
  
    if (start && end) {
      // Convertir les valeurs de `start` et `end` en objets `Date`
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      // Ajuster `endDate` pour inclure toute la journée jusqu'à 23:59:59
      endDate.setHours(23, 59, 59, 999);
  
      // Filtrer les ventes en fonction de la plage de dates
      this.filteredSales = this.sales.filter((sale) => {
        const saleDate = new Date(sale.lastUpdated); // Convertir `lastUpdated` en objet `Date`
        return saleDate >= startDate && saleDate <= endDate;
      });
    } else {
      // Si aucune plage de dates n'est définie, afficher toutes les ventes
      this.filteredSales = [...this.sales];
    }
    this.sortSalesByDate();
    // Recalculer les totaux
    this.calculateTotals(this.filteredSales);
  }
  
  // Réinitialiser le filtre de date
  resetDateFilter(): void {
    const today = new Date();
    this.dateRangeForm.setValue({
      start: today,
      end: today,
    });
  
    // Filtrer les données pour afficher uniquement celles du jour J
    this.filteredSales = this.sales.filter((sale) => {
      const saleDate = new Date(sale.lastUpdated);
      return (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    });
    this.sortSalesByDate();
    this.calculateTotals(this.filteredSales); // Recalcule les totaux
  }
  

  // Calculer les totaux
  calculateTotals(sales: any[]): void {
    this.totalProducts = sales.length;
    this.totalBuyPrice = sales.reduce((acc, sale) => acc + sale.buyPrice, 0);
    this.totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
    this.totalSellPrice = sales.reduce((acc, sale) => acc + sale.salesPrice, 0);

    // Calculer la marge absolue (valeur en dh)
    this.profitMarginAmount = this.totalSellPrice - this.totalBuyPrice;

    // Calculer la marge en pourcentage
    this.profitMarginPercentage =
      this.totalSellPrice > 0
        ? ((this.totalSellPrice - this.totalBuyPrice) / this.totalSellPrice) *
          100
        : 0;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout(): void {
    console.log('Logging out...');
  }

}
