import { Component } from '@angular/core';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { Vente } from '../models/vente.model';
import { AddCaisseService } from '../service/add-caisse.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-flush-caisse',
  standalone: false,

  templateUrl: './flush-caisse.component.html',
  styleUrl: './flush-caisse.component.css'
})
export class FlushCaisseComponent {
  caisses: any[] = []; // Liste des caisses
  sales: any[] = []; // Toutes les ventes
  filteredSales: Product[] = []; // Ventes filtrées pour la caisse sélectionnée
  selectedCaisseName: string = ''; // Nom de la caisse sélectionnée
  showPopup: boolean = false; // État du popup

  constructor(private addCaisseService: AddCaisseService, private salesService: HistoryService) {}

  ngOnInit(): void {
    this.loadCaisses(); // Charger les caisses à l'initialisation
  }

  // Charger la liste des caisses
  loadCaisses(): void {
    this.addCaisseService.getCaisses().subscribe(
      (data) => {
        this.caisses = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des caisses :', error);
      }
    );
  }

  // Charger les ventes de Jours J pour une caisse spécifique
  loadSalesData(caisseId: number): void {
    this.salesService.getSalesData().subscribe(
      (data) => {
        this.sales = data;

        const today = new Date();
        this.filteredSales = this.sales.filter((sale) => {
          const lastUpdated = new Date(sale.dateOrder);
          return (
            sale.caisseId === caisseId &&
            lastUpdated.getDate() === today.getDate() &&
            lastUpdated.getMonth() === today.getMonth() &&
            lastUpdated.getFullYear() === today.getFullYear()
          );
        });

        // Récupérer le nom de la caisse
        this.selectedCaisseName = this.caisses.find((caisse) => caisse.id === caisseId)?.nom || '';
        this.showPopup = true; // Ouvrir le popup
      },
      (error) => {
        console.error('Erreur lors du chargement des ventes :', error);
      }
    );
  }

  // Fermer le popup
  closePopup(): void {
    this.showPopup = false;
  }
}
