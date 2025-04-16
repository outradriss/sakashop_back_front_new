import { Component } from '@angular/core';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { Vente } from '../models/vente.model';
import { AddCaisseService } from '../service/add-caisse.service';
import { Product } from '../models/product.model';
import { VenteProduit } from '../venteProduit.interface';

@Component({
  selector: 'app-flush-caisse',
  standalone: false,

  templateUrl: './flush-caisse.component.html',
  styleUrl: './flush-caisse.component.css'
})
export class FlushCaisseComponent {
  caisses: any[] = []; // Liste des caisses
  sales: any[] = []; // Toutes les ventes
  filteredSales: VenteProduit[] = [];
; // Ventes filtrées pour la caisse sélectionnée
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
        const ventesAujourdHui = this.sales.filter((sale) => {
          const lastUpdated = new Date(sale.dateOrder);
          return (
            sale.caisseId === caisseId &&
            lastUpdated.getDate() === today.getDate() &&
            lastUpdated.getMonth() === today.getMonth() &&
            lastUpdated.getFullYear() === today.getFullYear()
          );
        });
  
        // ✅ Extraire les produits avec les infos de paiement + nom d'affichage
        this.filteredSales = ventesAujourdHui.flatMap((vente) =>
          (vente.items || []).map((item: any) => ({
            ...item,
            typePaiement: vente.typePaiement,
            productName: item.nameProduct || item.name
          }))
        ) as VenteProduit[];
  
        // ✅ Nom de la caisse affichée
        this.selectedCaisseName = this.caisses.find((caisse) => caisse.id === caisseId)?.nom || '';
        this.showPopup = true;
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
