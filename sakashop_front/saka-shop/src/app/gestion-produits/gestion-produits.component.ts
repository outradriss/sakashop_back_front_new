import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { Route, Router } from '@angular/router';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-produits',
  standalone: false,
  
  templateUrl: './gestion-produits.component.html',
  styleUrl: './gestion-produits.component.css'
})
export class GestionProduitsComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  showPopup: boolean = false;
  editingProduct: Product | null = null;
  applyDiscounting:  Product | null = null;  // Assurez-vous que c'est bien initialisé

  deletingProduct: Product | null = null;
  productForms: Product = this.resetProductForm();
  // Gestion des remises
  showDiscountPopup: boolean = false;
  showApplyDiscountPopup: boolean = false;
  discountSearchQuery: string = '';
  discountFilteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  discountPercentage: number = 0;
  promoPrice: number = 0;
  showConfirmDeletePopup: boolean = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Charger les produits depuis le backend
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        console.log(data)
        console.log(this.products)
        this.products = data;
        this.filteredProducts = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }


// Filtrer les produits
filterProducts(): void {
  const query = this.searchQuery?.trim().toLowerCase() || ''; // Gère les cas où searchQuery est null ou undefined
  this.filteredProducts = this.products.filter((product) =>
    (product.name?.toLowerCase().includes(query) || false) || // Vérifie si product.name existe
    (product.itemCode?.toLowerCase().includes(query) || false) // Vérifie si product.itemCode existe
  );
}


  // Ajouter, Modifier, Supprimer, Réinitialiser les champs, etc.
  showAddProductPopup(): void {
    this.showPopup = true;
    this.editingProduct = null;
    this.productForms = this.resetProductForm();
  }

  saveProduct(): void {
    // Vérifie et formate la date avant l'envoi
    if (this.productForms.productAddedDate) {
      this.productForms.productAddedDate = new Date(this.productForms.productAddedDate);
    }
  
    // Détermine le mode (ajout ou modification)
    const saveOperation = this.editingProduct
      ? this.productService.updateProduct(this.productForms.id, this.productForms)
      : this.productService.saveProduct(this.productForms);
  
    // Exécute l'opération correspondante
    saveOperation.subscribe(
      () => {
        const action = this.editingProduct ? 'modifié' : 'ajouté';
        alert(`Produit ${action} avec succès.`);
        this.showPopup = false; // Ferme le popup
        this.loadProducts(); // Rafraîchit la liste des produits
      },
      (error) => {
        const action = this.editingProduct ? 'modification' : 'ajout';
        console.error(`Erreur lors de la ${action} du produit :`, error);
        alert(`Erreur lors de la ${action} du produit.`);
      }
    );
  }
  
  
  refreshData(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error('Erreur lors du rafraîchissement des données', error);
        alert('Erreur lors du rafraîchissement des données');
      }
    );
  }
   // Gestion des remises
   showAddDiscountPopup(): void {
    this.showDiscountPopup = true;
  }

  hideDiscountPopup(): void {
    this.showDiscountPopup = false;
  }

  filterDiscountProducts(): void {
    const query = this.discountSearchQuery.trim().toLowerCase();
    this.discountFilteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }

  selectDiscountProduct(product: Product): void {
    this.selectedProduct = product;
  
    if (this.selectedProduct.isPromo) {
      // Si le produit est déjà en promo, afficher une boîte de dialogue de confirmation
      Swal.fire({
        title: 'Produit déjà en promotion',
        text: `Ce produit est déjà en promotion avec un prix promo de ${this.selectedProduct.pricePromo} DH. Voulez-vous appliquer une nouvelle remise ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, appliquer une nouvelle remise',
        cancelButtonText: 'Non, annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          // Si l'utilisateur confirme, préparer le popup pour une nouvelle remise
          this.discountPercentage = 0; // Réinitialiser le pourcentage de remise
          this.promoPrice = this.selectedProduct?.pricePromo || this.selectedProduct?.salesPrice || 0; 
          this.showDiscountPopup = false;
          this.showApplyDiscountPopup = true; // Afficher le popup de remise
        } else {
          // Réinitialiser le produit sélectionné si l'utilisateur annule
          this.selectedProduct = null;
        }
      });
    } else {
      // Si le produit n'est pas en promo, ouvrir directement le popup de remise
      this.discountPercentage = 0; // Réinitialiser le pourcentage de remise
      this.promoPrice = this.selectedProduct.salesPrice || 0;
      this.showDiscountPopup = false;
      this.showApplyDiscountPopup = true;
    }
  }
  
  

  calculatePromoPrice(): void {
    if (this.selectedProduct && this.selectedProduct.salesPrice && this.discountPercentage !== undefined) {
      const basePrice = this.selectedProduct.isPromo
        ? this.selectedProduct.pricePromo // Use the existing promo price if already in promotion
        : this.selectedProduct.salesPrice;
  
      const discountAmount = (basePrice * this.discountPercentage) / 100;
      this.promoPrice = +(basePrice - discountAmount).toFixed(2); // Calculate the new promo price
    } else {
      this.promoPrice = this.selectedProduct?.salesPrice || 0;
    }
  }
  

  checkPriceBeforeSave(): void {
    if (this.productForms.salesPrice < this.productForms.buyPrice) {
      Swal.fire({
        title: 'Prix de Vente inférieur au Prix d\'Achat',
        text: `Le prix de vente (${this.productForms.salesPrice} DH) est inférieur au prix d'achat (${this.productForms.buyPrice} DH). Voulez-vous continuer ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, continuer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveProduct();
        }
      });
    } else {
      this.saveProduct();
    }
  }
  
  
  
  
  applyDiscount(): void {
    if (!this.selectedProduct) {
      alert('Aucun produit sélectionné pour appliquer la remise.');
      return;
    }
  
    // Calcul du prix en promo
    if (this.selectedProduct.salesPrice && this.discountPercentage !== undefined) {
      const discountAmount = (this.selectedProduct.salesPrice * this.discountPercentage) / 100;
      this.selectedProduct.pricePromo = +(
        this.selectedProduct.salesPrice - discountAmount
      ).toFixed(2); // Calcul du prix promo
      this.selectedProduct.isPromo = true; // Indique que le produit est en promotion
    } else {
      alert('Erreur dans les données de remise.');
      return;
    }
  
    // Appel au backend pour mettre à jour le produit
    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
      (response) => {
        if (this.selectedProduct) {
          alert(
            `Remise appliquée :\nProduit : ${this.selectedProduct.name}\nPrix promo : ${this.selectedProduct.pricePromo} DH`
          );
        } else {
          alert('Aucun produit sélectionné pour appliquer la remise.');
        }
        
        this.loadProducts(); // Rafraîchir les produits
        this.hideApplyDiscountPopup(); // Fermer le popup
      },
      (error) => {
        console.error('Erreur lors de l\'application de la remise :', error);
        alert('Erreur lors de l\'application de la remise.');
      }
    );
  }

  hideApplyDiscountPopup(): void {
    this.showApplyDiscountPopup = false;
    this.selectedProduct = null;
    this.discountPercentage = 0;
    this.promoPrice = 0;
  }

  
  
  resetForm(): void {
    this.productForms= {
      id:0,
      itemCode: '',
      name: '',
      quantity: 0,
      buyPrice: 0,
      salesPrice: 0,
      category: '',
      supplier: '',
      pricePromo:0,
      isPromo:false,
      productAddedDate:new Date()
    };
  }
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  

    editProduct(product: Product): void {
      this.showPopup = true; // Affiche le popup
      this.editingProduct = product; // Définit le produit en cours de modification
      this.productForms = { ...product }; // Pré-remplit le formulaire avec les données du produit
      }
      openConfirmDeletePopup(product: Product): void {
        this.deletingProduct = product;
        this.showConfirmDeletePopup = true;
      }
      
      confirmDelete(): void {
        if (this.deletingProduct && this.deletingProduct.id) {
          this.productService.deleteProduct(this.deletingProduct.id).subscribe(
            () => {
              alert('Produit supprimé avec succès.');
              this.loadProducts(); // Rafraîchit la liste des produits
              this.showConfirmDeletePopup = false; // Ferme le popup
              this.deletingProduct = null;
            },
            (error) => {
              console.error('Erreur lors de la suppression du produit :', error);
              alert('Erreur lors de la suppression du produit.');
            }
          );
        }
      }
      
      cancelDelete(): void {
        this.showConfirmDeletePopup = false;
        this.deletingProduct = null;
      }
      deleteProduct(product: Product): void {
        if (product.id) {
          this.productService.deleteProduct(product.id).subscribe(
            (message) => {
              alert(message); // Affiche le message renvoyé par le backend
              this.loadProducts(); // Rafraîchissez la liste des produits
            },
            (error) => {
              console.error('Erreur lors de la suppression du produit :', error);
              alert('Erreur lors de la suppression du produit.');
            }
          );
        } else {
          alert("L'ID du produit est introuvable.");
        }
      }
  

  hidePopup(): void {
    this.showPopup = false;
    this.productForms = this.resetProductForm();
  }
  
  private resetProductForm(): Product {
    return {
      id:0,
      itemCode: '',
      name: '',
      quantity: 0,
      buyPrice: 0,
      salesPrice: 0,
      category: '',
      supplier: '',
      pricePromo:0,
      isPromo:false,
      productAddedDate:new Date()
    };
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
  exportToCSV(): void {
    const csvData = this.generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'produits.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Générer les données CSV à partir de la liste des produits
   * @returns {string} Les données formatées en CSV
   */
  private generateCSVData(): string {
    const headers = [
      'ID',
      'Code Produit',
      'Nom',
      'Quantité',
      'Prix d\'Achat',
      'Prix de Vente',
      'Catégorie',
      'Fournisseur',
      'En Promotion',
      'Prix Promo',
      'Date d\'Ajout'
    ].join(',');

    const rows = this.products.map((product) => [
      product.id,
      product.itemCode,
      product.name,
      product.quantity,
      product.buyPrice,
      product.salesPrice,
      product.category,
      product.supplier,
      product.isPromo ? 'Oui' : 'Non',
      product.pricePromo,
      product.productAddedDate
    ].join(','));

    return [headers, ...rows].join('\n');
  }
}
