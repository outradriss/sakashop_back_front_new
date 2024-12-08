import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../service/credit.service';
import { Product } from '../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-clients',
  standalone: false,
  
  templateUrl: './credit-clients.component.html',
  styleUrl: './credit-clients.component.css'
})
export class CreditClientsComponent {
  constructor(private router: Router, private http: HttpClient , private creditService :CreditService) {}
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
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
  credits:any=[];
  comment : String='';
  showDetailsPopup = false;
  selectedCredit: any = null;
  currentPage: number = 1; // Page actuelle
itemsPerPage: number = 10; // Nombre d'éléments par page
paginatedCredits: any[] = []; // Données paginées
totalPages: number[] = [];
filteredCredits: any[] = [];
showPayPopup: boolean = false;
payAmount: number = 0; 

  ngOnInit() {
    this.loadProducts();
    this.loadProductsCredit();
  }
  // Ouvre le popup pour payer
openPayPopup(credit: any): void {
  this.selectedCredit = credit;
  this.payAmount = credit.totale; // Par défaut, montant total
  this.showPayPopup = true;
}

// Ferme le popup sans effectuer d'action
closePayPopup(): void {
  this.showPayPopup = false;
  this.selectedCredit = null;
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
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) || 
      product.id.toString().includes(query)
    );
  }
  viewDetails(credit: any): void {
    this.selectedCredit = credit;
    this.showDetailsPopup = true;
  }

  // Fermer le popup des détails
  closeDetailsPopup(): void {
    this.selectedCredit = null;
    this.showDetailsPopup = false;
  }

  // Afficher la barre de recherche
  showSearchBar(): void {
    this.showSearch = true;
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
    this.productPrice = product.salesPrice; // Mise à jour du prix
    this.productName = product.name; 
    this.quantity=product.quantity;
    this.showSearch = false; // Masquer la barre de recherche
    this.showPopup = true; // Afficher le popup
    this.calculateTotal();
  }
  addAnotherCredit(clientName: string): void {
    this.clientName = clientName; // Préremplir le nom du client
    this.showDetailsPopup = false; // Fermer le popup des détails
    this.showSearch = true; // Ouvrir la barre de recherche
  }
  loadProductsCredit(): void {
    this.creditService.getAllCredits()
      .subscribe(
        (response) => {
          this.credits = response; // Mettre à jour le tableau des crédits
          this.updatePagination();
          console.log('Données des crédits chargées :', this.credits);
        },
        (error) => {
          console.error('Erreur lors du chargement des crédits :', error);
        }
      );
  }
  // Enregistrer le crédit (pourrait être développé pour l'ajouter au tableau ou à une base de données)
    // Méthode pour enregistrer le crédit
    saveCredit(): void {
      const newProduct = {
        productName: this.productName,
        productPrice: this.productPrice,
        quantity: this.quantity,
        total: this.total,
        creditDate: this.creditDate,
        comment:this.comment,
        dueDate:this.dueDate
      };
    
      // Vérifier si le client existe déjà dans les crédits
      const existingCredit = this.credits.find((c: any) => c.clientName === this.clientName);
    
      if (existingCredit) {
        // Ajouter le produit à la liste des produits existants
        existingCredit.products.push(newProduct);
    
        // Mettre à jour la quantité totale et le montant total
        existingCredit.totalQuantity += this.quantity;
        existingCredit.totalAmount += this.total;
    
        // Mettre à jour la date du dernier crédit
        existingCredit.lastCreditDate = this.creditDate;
      } else {
        // Ajouter un nouveau crédit pour ce client
        this.credits.push({
          clientName: this.clientName,
          totalQuantity: this.quantity,
          totalAmount: this.total,
          lastCreditDate: this.creditDate,
          products: [newProduct],
          comment:this.comment,
          dueDate:this.dueDate
        });
      }
      
    
      // Fermer le popup et recharger les données
      this.showPopup = false;
    
      // Charger les crédits à jour après sauvegarde
      this.creditService.postCredit({ ...newProduct, clientName: this.clientName }).subscribe(
        () => {
          this.loadProductsCredit(); // Recharger les données
        },
        (error) => {
          console.error('Erreur lors de l\'enregistrement du crédit :', error);
        }
      );
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
filterClientByName(): void {
  const query = this.searchQuery.toLowerCase();
  this.filteredCredits = this.credits.filter((credit: any) =>
    credit.nameClient.toLowerCase().startsWith(query)
  );
}

  // Fermer le popup
  closePopup(): void {
    this.productName = '';
    this.productPrice = 0;
    this.clientName = '';
    this.quantity = 1;
    this.total = 0;
    this.creditDate = '';
    this.dueDate = '';
    this.showPopup = false;
  }

  private resetForm(): void {
    this.clientName = '';
    this.productName = '';
    this.productPrice = 0;
    this.quantity = 1;
    this.total = 0;
    this.creditDate = '';
    this.dueDate = '';
  }

  editCredit(index: number): void {
    const credit = this.credits[index];
    this.productName = credit.productName;
    this.productPrice = credit.productPrice;
    this.clientName = credit.clientName;
    this.quantity = credit.quantity;
    this.total = credit.total;
    this.creditDate = credit.creditDate;
    this.dueDate = credit.dueDate;
    this.showPopup = true; // Ouvre le popup pour modification
  }
  
  deleteCredit(index: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce crédit ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.credits.splice(index, 1);
        Swal.fire(
          'Supprimé !',
          'Le crédit a été supprimé avec succès.',
          'success'
        );
      }
    });
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
