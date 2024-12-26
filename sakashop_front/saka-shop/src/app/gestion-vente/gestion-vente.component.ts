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
          const lastUpdated = new Date(sale.dateOrder);
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

  resetDateFilter(): void {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
    this.dateRangeForm.setValue({
      start: startOfDay,
      end: endOfDay,
    });
  
    // Réinitialiser pour afficher uniquement les données d'aujourd'hui
    this.filteredSales = this.sales.filter((sale) => {
      const saleDate = new Date(sale.dateOrder);
      return saleDate >= startOfDay && saleDate <= endOfDay;
    });
  
    this.sortSalesByDate();
    this.calculateTotals(this.filteredSales); // Recalcule les totaux
  }
  
  applyDateFilter(): void {
    const startDate = new Date(this.dateRangeForm.value.start);
    const endDate = new Date(this.dateRangeForm.value.end);
  
    if (startDate && endDate) {
      // Ajuster les dates pour inclure toute la journée
      const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
  
      // Filtrer les ventes dans la plage de dates sélectionnée
      this.filteredSales = this.sales.filter((sale) => {
        const saleDate = new Date(sale.dateOrder);
        return saleDate >= startOfDay && saleDate <= endOfDay;
      });
  
      this.sortSalesByDate();
      this.calculateTotals(this.filteredSales); // Recalcule les totaux
    }
  }
  
  sortSalesByDate(): void {
    this.filteredSales.sort(
      (a, b) => new Date(a.dateOrder).getTime() - new Date(b.dateOrder).getTime()
    );
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
