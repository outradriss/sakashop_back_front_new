import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Vente } from '../models/vente.model';
import { Chart } from 'chart.js';

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
  products: Vente[] = [];
  bestSellingProducts: any[] = [];
  topSellingProduct3Months: { name: string; quantity: number } = { name: '', quantity: 0 };
  topSellingProduct6Months: { name: string; quantity: number } = { name: '', quantity: 0 };
  topSellingProductMonth: { name: string; quantity: number } = { name: '', quantity: 0 };
 topSellingProductWeek: { name: string; quantity: number } = { name: '', quantity: 0 };
 leastSellingProduct: { name: string; quantity: number } = { name: '', quantity: 0 };

 currentView: string = 'gestion-vente'; // Par défaut, afficher la gestion de vente

 
  // Date Range sélectionné
  dateRangeForm!: FormGroup;

  constructor(
    private router: Router,
    private salesService: HistoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadSalesData();
    this.calculateTotals(this.filteredSales); // Calcul des totaux

    // Initialisation correcte du FormGroup
    const today = new Date();
    this.dateRangeForm = this.fb.group({
      start: [today], // Contrôle pour la date de début
      end: [today],   // Contrôle pour la date de fin
    });
  }
  exportToCSV(): void {
    const csvData = this.generateCSVData();
    const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    link.setAttribute('href', url);
    link.setAttribute('download', 'ventes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  


  generateCSVData(): string {
    const header = ['Référence', 'Produit', 'Quantité', 'Prix Vente TTC', 'Prix Total TTC', 'Type de Paiement', 'Date de Commande'];
  
    const rows = this.filteredSales.flatMap(sale => 
      sale.items.map((item: { code: string; nameProduct: string; quantity: number; salesPrice: number; totalePrice: number }) => [
        item.code || 'N/A', // Référence
        item.nameProduct, // Produit
        item.quantity, // Quantité
        item.salesPrice.toFixed(2) + ' MAD', // Prix Vente TTC
        item.totalePrice.toFixed(2) + ' MAD', // Prix Total TTC
        sale.typePaiement, // Type de Paiement
        new Date(sale.dateOrder).toLocaleString() // Date de Commande
      ].join(';'))
    );
  
    return [header.join(';'), ...rows].join('\n');
  }
  
  
  
  loadSalesData(): void {
    this.salesService.getSalesData().subscribe(
      (data) => {
        this.sales = data;
  
        // ✅ Filtrer les ventes des dernières 24 heures
        const today = new Date();
        this.filteredSales = this.sales.filter((sale) => {
          const saleDate = new Date(sale.dateOrder);
          return (
            saleDate.getDate() === today.getDate() &&
            saleDate.getMonth() === today.getMonth() &&
            saleDate.getFullYear() === today.getFullYear()
          );
        });
        this.calculateTotals(this.filteredSales); // Recalcule les totaux
  
        // ✅ Trouver les produits les plus vendus sur différentes périodes
        this.topSellingProductWeek = this.getBestSellingProduct(7);
        this.topSellingProductMonth = this.getBestSellingProduct(30);
        this.topSellingProduct3Months = this.getBestSellingProduct(90);
  
        // ✅ Trouver le produit le moins vendu
        this.leastSellingProduct = this.getLeastSellingProduct();
  
        // ✅ Récupérer la liste des produits les plus vendus pour le tableau
        this.bestSellingProducts = this.getBestSellingProducts();
  
        // ✅ Afficher le graphique d'évolution des ventes
        this.loadSalesChart();
      },
      (error) => {
        console.error('Erreur lors du chargement des données :', error);
      }
    );
  }
  

  getBestSellingProduct(days: number): { name: string; quantity: number } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
  
    const salesInPeriod = this.sales.filter((sale: any) => {
      const saleDate = new Date(sale.dateOrder);
      return saleDate >= cutoffDate;
    });
  
    const productCounts = new Map<string, { name: string; quantity: number }>();
  
    salesInPeriod.forEach((sale: any) => {
      sale.items.forEach((item: { nameProduct: string; quantity: number }) => {
        if (!productCounts.has(item.nameProduct)) {
          productCounts.set(item.nameProduct, { name: item.nameProduct, quantity: 0 });
        }
        productCounts.get(item.nameProduct)!.quantity += item.quantity;
      });
    });
  
    return [...productCounts.values()].reduce((max, product) => (product.quantity > max.quantity ? product : max), { name: 'Aucun', quantity: 0 });
  }
  

  
  getLeastSellingProduct(): { name: string; quantity: number } {
    const productCounts = new Map<string, { name: string; quantity: number }>();
  
    this.sales.forEach((sale: any) => {
      sale.items.forEach((item: { nameProduct: string; quantity: number }) => {
        if (!productCounts.has(item.nameProduct)) {
          productCounts.set(item.nameProduct, { name: item.nameProduct, quantity: 0 });
        }
        productCounts.get(item.nameProduct)!.quantity += item.quantity;
      });
    });
  
    return [...productCounts.values()].reduce(
      (min, product) => (product.quantity < min.quantity ? product : min),
      { name: 'Aucun', quantity: Infinity }
    );
  }
  

  getBestSellingProducts(): { name: string; quantity: number; salesPrice: number; promoCount: number }[] {
    const productCounts = new Map<string, { name: string; quantity: number; salesPrice: number; promoCount: number }>();
  
    this.sales.forEach((sale: any) => {
      sale.items.forEach((item: { nameProduct: string; quantity: number; salesPrice: number; isPromo?: boolean }) => {
        if (!productCounts.has(item.nameProduct)) {
          productCounts.set(item.nameProduct, { 
            name: item.nameProduct, 
            quantity: 0, 
            salesPrice: item.salesPrice, 
            promoCount: 0 
          });
        }
        const product = productCounts.get(item.nameProduct)!;
        product.quantity += item.quantity;
        if (item.isPromo) {
          product.promoCount += 1;
        }
      });
    });
  
    return [...productCounts.values()].sort((a, b) => b.quantity - a.quantity);
  }
  

loadSalesChart(): void {
    const salesByDay = new Map();
  
    this.sales.forEach((sale) => {
      const saleDate = new Date(sale.dateOrder).toISOString().split('T')[0]; // Format YYYY-MM-DD
      if (!salesByDay.has(saleDate)) {
        salesByDay.set(saleDate, 0);
      }
      salesByDay.set(saleDate, salesByDay.get(saleDate) + 1);
    });
  
    const labels = [...salesByDay.keys()];
    const data = [...salesByDay.values()];
  
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
   console.log("🔍 Vérification du canvas:", ctx);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Nombre de ventes',
          data,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderWidth: 2
        }]
      },
      options: { responsive: true }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadSalesChart();
    }, 500); // 🔹 Attendre 500ms pour s'assurer que le DOM est prêt
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
  navigateBack(): void {
    this.currentView = 'main'; // Remet la vue principale
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
  
  
  calculateTotals(sales: any[]): void {
    this.totalProducts = 0;
    this.totalQuantity = 0;
    this.totalSellPrice = 0;
    this.totalBuyPrice = 0;

    sales.forEach((sale) => {
        if (sale.items && Array.isArray(sale.items)) {
            this.totalProducts += sale.items.length; // Nombre total de produits vendus (chaque ligne)
            
            sale.items.forEach((item: any) => {
                this.totalQuantity += item.quantity || 0; // Somme des quantités de chaque produit
                this.totalSellPrice += item.totalePrice || 0; // Somme des prix totaux des produits
                this.totalBuyPrice += (item.buyPrice || 0) * (item.quantity || 0); // Calcul total du prix d'achat
            });
        }
    });

    // Calcul de la marge absolue
    this.profitMarginAmount = this.totalSellPrice - this.totalBuyPrice;

    // Calcul de la marge en pourcentage
    this.profitMarginPercentage =
        this.totalSellPrice > 0
            ? ((this.profitMarginAmount) / this.totalSellPrice) * 100
            : 0;
}


  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  navigateToBest(view: string): void {
    this.currentView = view;
  }
  
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  
}
