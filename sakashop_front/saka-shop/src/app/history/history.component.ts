import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  productId!: number; // ID du produit
  productHistory: any[] = []; // Stocke les données retournées par le backend
  originalProductHistory: any[] = []; 
  paginatedProductHistory: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10; // Nombre de lignes à afficher par page
  pages: number[] = [];
  startDate: string | null = null;
  endDate: string | null = null;
  showDateRangePicker = false;
  selectedProduct: any = null;
  purchaseHistory: any[] = []; // Historique d'achat
  salesHistory: any[] = []; // Historique de vente
  showPurchase: boolean = true && false; 
  showSales: boolean = false; // Affiche le tableau de vente

  constructor(private router : Router , private route : ActivatedRoute , private historyservice : HistoryService){}
  ngOnInit(): void {
    // Récupérer l'ID du produit depuis l'URL
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProductHistory(); // Charger les données
      }
    });
  }

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  loadProductHistory(): void {
    this.historyservice.getProductHistory(this.productId).subscribe((data) => {
      console.log('Données reçues du backend :', data);
  
      if (data.length > 0) {
        // Initialisation des détails du produit
        this.selectedProduct = {
          nameProduct: data[0].nameProduct,
          itemCode: data[0].itemCode,
        };
        this.originalProductHistory = [...data];
        this.productHistory=[...data];
  
        // Déterminer l'historique d'achat et de vente
        this.purchaseHistory = data.filter((item) =>
          item.hasOwnProperty('productAddedDate') && item.hasOwnProperty('stockQuantity') // Critères pour achat
        );
        this.salesHistory = data.filter((item) =>
          item.hasOwnProperty('orderId') && item.hasOwnProperty('cartQuantity') // Critères pour vente
        );
  
        console.log('Historique d\'achat :', this.purchaseHistory);
        console.log('Historique de vente :', this.salesHistory);
  
        // Définir l'historique de vente comme affichage par défaut
        this.showSalesHistory();
      } else {
        console.warn('Aucune donnée reçue du backend.');
      }
    },
    (error) => {
      console.error('Erreur lors de la récupération des données :', error);
    });
  }
   

  showPurchaseHistory(): void {
    if (this.purchaseHistory && this.purchaseHistory.length > 0) {
        this.productHistory = [...this.purchaseHistory]; // Utilisation des données locales d'achat
        console.log('Affichage de l\'historique d\'achat :', this.productHistory);
    } else {
        this.productHistory = []; // Si aucune donnée d'achat, vide la table
        console.warn('Aucun historique d\'achat disponible.');
    }
    this.showPurchase = true;
    this.showSales = false; // Toujours désactiver l'affichage des ventes
}



showSalesHistory(): void {
  if (this.salesHistory && this.salesHistory.length > 0) {
      this.productHistory = [...this.salesHistory]; // Utilisation des données locales de vente
      console.log('Affichage de l\'historique de vente :', this.productHistory);
  } else {
      this.productHistory = []; // Si aucune donnée de vente, vide la table
      console.warn('Aucun historique de vente disponible.');
  }
  this.showPurchase = false;
  this.showSales = true; // Toujours désactiver l'affichage des achats
}

  
  
  setPagination(): void {
    const totalPages = Math.ceil(this.productHistory.length / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i);
    this.changePage(0);
  }
  
  changePage(page: number): void {
    this.currentPage = page;
    const start = page * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProductHistory = this.productHistory.slice(start, end);
  }


  calculateRemainingQuantity(): number {
    return this.productHistory.reduce((total : any, product:any) =>  product.stockQuantity, 0);
  }
  
  calculateSoldQuantity(): number {
    return this.productHistory.reduce((total:any, product:any) => total + product.cartQuantity, 0);
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
  filterByDateRange(): void {
    if (this.range.value.start && this.range.value.end) {
      const start = new Date(this.range.value.start).setHours(0, 0, 0, 0); // Début de journée
      const end = new Date(this.range.value.end).setHours(23, 59, 59, 999); // Fin de journée
  
      console.log('Start Timestamp:', start, 'End Timestamp:', end);
  
      // Vérifiez les valeurs avant de continuer
      console.log('Données avant filtrage:', this.originalProductHistory);
  
      // Filtrer les données en fonction de la plage de dates
        this.productHistory = this.originalProductHistory.filter((product: any) => {
        const orderDate = new Date(product.orderDate).getTime(); // Assurez-vous que orderDate est valide
        const isInRange = orderDate >= start && orderDate <= end;
        console.log('OrderDate Timestamp:', orderDate, 'Is in Range:', isInRange);
        return isInRange;
      });
  
      if (this.productHistory.length === 0) {
        console.warn('Aucune donnée trouvée pour la plage de dates sélectionnée.');
      }
    } else {
      console.warn('Veuillez sélectionner une plage de dates valide.');
      this.resetDateRange(); // Réinitialise les données si aucune plage n'est sélectionnée
    }
  }
  
 
  parseOrderDate(dateStr: string): Date {
    try {
        // Vérifie si dateStr est une chaîne valide
        if (!dateStr) {
            throw new Error('Date invalide ou non définie');
        }
        // Crée un objet Date directement à partir de la chaîne ISO
        return new Date(dateStr);
    } catch (e) {
        console.error('Erreur lors du parsing de la date:', dateStr, e);
        throw new Error(`Format de date invalide : ${dateStr}`);
    }
}


  resetDateRange(): void {
    this.range.reset();
    this.productHistory = [...this.originalProductHistory];
    this.loadProductHistory();
  }
  

  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
}
