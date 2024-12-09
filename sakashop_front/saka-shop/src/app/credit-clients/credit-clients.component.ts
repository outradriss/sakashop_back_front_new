import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../service/credit.service';
import { Product } from '../models/product.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Credit } from '../models/Credit.model';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-credit-clients',
  standalone: false,
  
  templateUrl: './credit-clients.component.html',
  styleUrl: './credit-clients.component.css'
})
export class CreditClientsComponent {
  constructor(private router: Router, private http: HttpClient , private creditService :CreditService , private sharedService: SharedService) {}
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  searchProductQuery: string='';
  showSearch: boolean = false; 
  clientName: string = '';
  datePayCredit:string='';
  selectedProduct: Product | null = null;
  showPopup: boolean = false; 
  productPrice: number = 0; 
  productName: string = '';
  quantity: number = 1;
  total: number = 0;
  creditDate: string = '';
  dueDate: string = '';
  credits:Credit[]=[];
  comment : string='';
  showDetailsPopup = false;
  selectedCredit: any = null;
  currentPage: number = 1; // Page actuelle
itemsPerPage: number = 10; // Nombre d'éléments par page
paginatedCredits: Credit[] = []; // Données paginées
totalPages: number[] = [];
filteredCredits: Credit[] = [];
showPayPopup: boolean = false;
payAmount: number = 0; 
isEditMode: boolean = false; 

  ngOnInit() {
    this.loadProducts();
    this.loadProductsCredit();
  }
  // Ouvre le popup pour payer
  openPayPopup(credit: Credit): void {
    this.selectedCredit = credit;
    this.payAmount = credit.totale; // Par défaut, montant total
    this.showPayPopup = true; // Afficher le popup de paiement
  }
  
  closePayPopup(): void {
    this.selectedCredit = null;
    this.payAmount = 0;
    this.showPayPopup = false; // Fermer le popup
  }

// Effectue le paiement
payCredit(): void {
  if (this.payAmount <= 0 || this.payAmount > this.selectedCredit.totale) {
    alert("Montant invalide. Veuillez entrer un montant valide.");
    return;
  }

  // Mettre à jour le crédit
  const remainingAmount = this.selectedCredit.totale - this.payAmount;
  this.selectedCredit.totale = remainingAmount;

  // Fermer le popup
  this.showPayPopup = false;
  this.selectedCredit = null;

  // Afficher un message de succès
  alert("Paiement effectué avec succès !");
  this.sharedService.notifyReloadProducts();
  this.sharedService.notifyReloadCaisse();
}
  // Charger les produits depuis le backend
  loadProducts(): void {
    this.creditService.getAllInCredit().subscribe(
      (data: Product[]) => {
        this.products = [...data];
        this.filteredProducts = [...this.products];
      },
      (error) => console.error('Erreur lors du chargement des produits', error)
    );
  }

  // Filtrer les produits en fonction de la recherche
  filterProducts(): void {
    const query = this.searchProductQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) || 
      product.id.toString().includes(query)
    );
  }
  filterClientByName(): void {
    const query = this.searchQuery.trim().toLowerCase(); // Récupérer et normaliser la recherche
    if (query) {
      // Filtrer les crédits affichés dans le tableau (basé sur les crédits paginés)
      this.paginatedCredits = this.credits.filter((credit: Credit) =>
        credit.nameClient.toLowerCase().startsWith(query)
      );
    } else {
      // Si la recherche est vide, réinitialiser le tableau avec toutes les données
      this.updatePagination();
    }
  }
  
  viewDetails(credit: Credit): void {
    this.selectedCredit = credit;
    this.showDetailsPopup = true;
  }

  // Fermer le popup des détails
  closeDetailsPopup(): void {
    this.selectedCredit = null;
    this.showDetailsPopup = false;
  }

  // Afficher la barre de recherche
  showSearchBar(isEditMode: boolean = false): void {
    this.isEditMode = isEditMode; // Définit le mode (ajout ou modification)
    this.selectedCredit = null; // Réinitialise le crédit sélectionné
    this.resetForm(); // Réinitialise le formulaire
    this.showSearch = true; // Affiche la barre de recherche
  }
  

  // Annuler la recherche et masquer la barre
  cancelSearch(): void {
    this.showSearch = false;
    this.searchQuery = '';
    this.filteredProducts = [...this.products];
  }

  // Sélectionner un produit et ouvrir le popup
  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.productPrice = product.salesPrice;
    this.productName = product.name;
    this.quantity = 1; 
    this.showSearch = false; // Ferme la barre de recherche
  
    if (!this.isEditMode) {
      this.showPopup = true; // Mode "Ajouter Crédit"
    } 
    this.calculateTotal();
  }
  
  addAnotherCredit(clientName: string): void {
    this.clientName = clientName; // Préremplir le nom du client
    this.isEditMode = false; // Forcer le mode "Ajouter Crédit"
    this.selectedCredit = null; // Réinitialiser le crédit sélectionné
    this.resetForm(); // Réinitialiser le formulaire
    this.showDetailsPopup = false; // Fermer le popup des détails
    this.showSearch = true; // Ouvrir la barre de recherche
  }
  
  loadProductsCredit(): void {
    this.creditService.getAllCredits().subscribe(
      (response: Credit[]) => {
        this.credits = response;
        this.filteredCredits = [...this.credits];
        this.updatePagination();
      },
      (error) => console.error('Erreur lors du chargement des crédits:', error)
    );
  }
  // Enregistrer le crédit (pourrait être développé pour l'ajouter au tableau ou à une base de données)
  
  saveCredit(): void {
    const newCredit: Credit = {
      id: 0,
      nameClient: this.clientName,
      quantity: this.quantity,
      totale: this.total,
      localDateTime: this.creditDate,
      datePayCredit: this.dueDate,
      comment: this.comment,
      productName: this.productName,
      product: { id: 0 } as Product,
    };
  
    this.creditService.postCredit(newCredit).subscribe({
      next: () => {
        this.loadProductsCredit();
        this.closePopup();
        Swal.fire({
          title: 'Succès',
          text: 'Le crédit a été enregistré avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.sharedService.notifyReloadProducts();
        this.sharedService.notifyReloadCaisse();
      },
      error: (error) => {
        const errorMessage = error.message || 'Une erreur est survenue lors de la mise à jour du crédit.';
        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });

  }

  deletCredit(credit: Credit): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment annuler ce crédit ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appeler le service pour supprimer le crédit
        this.creditService.deleteCredit(credit.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'Le crédit a été annulé avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.loadProductsCredit();
            this.loadProducts(); 
            this.sharedService.notifyReloadProducts();
            this.sharedService.notifyReloadCaisse();
          },
          error: (error) => {
            Swal.fire({
              title: 'Erreur',
              text: error.error?.message || 'Une erreur s\'est produite lors de l\'annulation du crédit.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Erreur lors de l\'annulation du crédit :', error);
          }
        });
      }
    });
  }
  


  updateCredit(): void {
    if (!this.selectedCredit) {
      Swal.fire({
        title: 'Erreur',
        text: "Aucun crédit sélectionné pour l'édition.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    // Préparer les informations mises à jour
    this.selectedCredit.productName = this.productName;
    this.selectedCredit.productPrice = this.productPrice;
    this.selectedCredit.quantity = this.quantity;
    this.selectedCredit.total = this.total;
    this.selectedCredit.localDateTime = this.creditDate;
    this.selectedCredit.datePayCredit = this.dueDate;
    this.selectedCredit.comment = this.comment;
  
    // Appeler l'API pour mettre à jour le crédit
    this.creditService.updateCredit(this.selectedCredit).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès',
          text: 'Le Client a été modifié avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.loadProductsCredit(); // Recharger les données
        this.showPopup = false; // Fermer le popup
      },
      error: (error) => {
        const errorMessage = error.message || 'Une erreur est survenue lors de la mise à jour du crédit.';
        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
  

 confirmPayment(): void {
      if (this.payAmount <= 0 || this.payAmount > this.selectedCredit.totale) {
        Swal.fire({
          title: 'Erreur',
          text: 'Montant invalide. Veuillez entrer un montant valide.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
    
      // Vérifier si le paiement couvre l'intégralité du crédit
      const remainingAmount = this.selectedCredit.totale - this.payAmount;
    
      if (remainingAmount === 0) {
        // Supprimer le crédit car le montant total est payé
        this.creditService.payCredit(this.selectedCredit.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès',
              text: 'Le crédit a été payé et supprimé avec succès.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
    
            // Recharge ou mise à jour des crédits après suppression
            this.loadProductsCredit();
            this.closePayPopup();
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de supprimer le crédit. Veuillez réessayer.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
      } else {
        // Mettre à jour uniquement le montant restant
        this.selectedCredit.totale = remainingAmount;
    
        Swal.fire({
          title: 'Succès',
          text: 'Le paiement partiel a été effectué avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
    
        // Fermer le popup
        this.closePayPopup();
    
        // Recharge ou mise à jour des crédits si nécessaire
        this.loadProductsCredit();
      }
    }
    

 
    openEditPopup(credit: Credit): void {
      this.selectedCredit = credit;
      this.isEditMode = true; // Définit le mode modification
      this.clientName = credit.nameClient;
      this.productPrice = credit.product.salesPrice || 0;
      this.productName = credit.product.name;
      this.quantity = credit.quantity;
      this.total = credit.totale;
      this.creditDate = credit.localDateTime;
      this.dueDate = credit.datePayCredit;
      this.comment = credit.comment;
      this.selectedProduct = credit.product;
      this.showPopup = true;
    }
    
    updatePagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCredits = this.credits.slice(startIndex, endIndex);
    
      // Met à jour les numéros de pages
      const pagesCount = Math.ceil(this.credits.length / this.itemsPerPage);
      this.totalPages = Array.from({ length: pagesCount }, (_, i) => i + 1);
    }
    
    changePage(page: number): void {
      this.currentPage = page;
      this.updatePagination();
    }

   // Méthode pour calculer le total
   calculateTotal(): void {
    if (this.quantity && this.productPrice) {
      this.total = this.quantity * this.productPrice;
    } else {
      this.total = 0; // Valeur par défaut si quantité ou prix est invalide
    }
  }
  
 
  // Méthode pour filtrer les clients par nom

  // Fermer le popup
  closePopup(): void {
    this.isEditMode = false; // Repasse en mode "Ajouter Crédit"
    this.selectedCredit = null; // Réinitialise le crédit sélectionné
    this.resetForm(); // Réinitialise le formulaire
    this.showPopup = false; // Ferme le popup
  }
  
  private resetForm(): void {
    this.clientName = '';
    this.productPrice = 0;
    this.productName = '';
    this.quantity = 1;
    this.total = 0;
    this.creditDate = '';
    this.dueDate = '';
    this.comment = '';
    this.selectedProduct = null;
  }
  
  
  markAsPaid(index: number): void {
    alert('Le crédit a été marqué comme payé !');
    // Ajoutez ici une logique supplémentaire pour marquer comme payé (ex. mise à jour backend)
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
