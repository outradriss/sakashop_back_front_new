import { Component } from '@angular/core';
import { Categories, Product } from '../models/product.model';
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
  newCategoryName: string = '';
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
  newCategory: Categories= { id: 0, name: '', createdDate: '' };
  showCategoryPopup = false;
  categories: Categories[]=[]; // Liste des noms de catégories
  
  constructor(private productService: ProductService, private router: Router) {}


loadCategoriesFromProducts(): void {
  if (this.products && this.products.length > 0) {
    // Extraire les catégories uniques
    const uniqueCategories = new Map<number, Categories>();
    this.products.forEach((product) => {
      if (product.categories) {
        uniqueCategories.set(product.categories.id, product.categories);
      }
    });
    this.categories = Array.from(uniqueCategories.values()); // Convertir en tableau
    console.log('Catégories extraites des produits :', this.categories);
  } else {
    console.warn('Aucun produit trouvé pour extraire les catégories.');
    this.categories = [];
  }
}

  // Charger les produits depuis le backend
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loadCategoriesFromProducts(); // Extraire les catégories
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
    if (!this.productForms.categories || !this.productForms.categories.id) {
      alert('Veuillez sélectionner une catégorie.');
      return;
    }
  
    // Continuer avec la sauvegarde
    const saveOperation = this.editingProduct
      ? this.productService.updateProduct(this.productForms.id, this.productForms)
      : this.productService.saveProduct(this.productForms);
  
    saveOperation.subscribe(
      () => {
        const action = this.editingProduct ? 'modifié' : 'ajouté';
        alert(`Produit ${action} avec succès.`);
        this.showPopup = false; // Ferme le popup
        this.loadProducts(); // Rafraîchit la liste des produits
      },
      (error) => {
        console.error(`Erreur lors de la sauvegarde du produit :`, error);
        alert(`Erreur lors de la sauvegarde du produit.`);
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
// Afficher le popup pour sélectionner un produit
showAddDiscountPopup(): void {
  this.showDiscountPopup = true;
}

// Cacher le popup de sélection de produit
hideDiscountPopup(): void {
  this.showDiscountPopup = false;
}

// Filtrer les produits pour le popup de sélection
filterDiscountProducts(): void {
  const query = this.discountSearchQuery.trim().toLowerCase();
  this.discountFilteredProducts = this.products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
}

// Vérifier et sélectionner un produit pour une remise
selectDiscountProduct(product: Product): void {
  this.selectedProduct = product;

  if (this.selectedProduct.isPromo) {
    // Si le produit est déjà en promo, afficher un message d'avertissement
    Swal.fire({
      title: 'Produit déjà en promotion',
      text: `Ce produit est déjà en promotion avec un prix promo de ${this.selectedProduct.pricePromo} DH.`,
      icon: 'info',
      confirmButtonText: 'OK',
    });
    this.selectedProduct = null; // Réinitialiser le produit sélectionné
  } else {
    // Si le produit n'est pas en promo, ouvrir le popup pour une nouvelle remise
    this.discountPercentage = 0; // Réinitialiser le pourcentage de remise
    this.promoPrice = this.selectedProduct.salesPrice || 0;
    this.showDiscountPopup = false; // Fermer le popup de sélection
    this.showApplyDiscountPopup = true; // Ouvrir le popup de remise
  }
}

// Calculer le prix promo en fonction du pourcentage de remise
calculatePromoPrice(): void {
  if (this.selectedProduct && this.discountPercentage !== undefined) {
    const basePrice = this.selectedProduct.salesPrice;
    const discountAmount = (basePrice * this.discountPercentage) / 100;
    this.promoPrice = +(basePrice - discountAmount).toFixed(2); // Calculer le nouveau prix promo
  } else {
    this.promoPrice = this.selectedProduct?.salesPrice || 0;
  }
}

// Appliquer la remise
applyDiscount(): void {
  if (!this.selectedProduct) {
    alert('Aucun produit sélectionné pour appliquer la remise.');
    return;
  }

  // Vérification et application du prix promo
  if (this.promoPrice > 0) {
    this.selectedProduct.pricePromo = this.promoPrice; // Définir le nouveau prix promo
    this.selectedProduct.isPromo = true; // Activer isPromo après application
  } else {
    alert('Erreur dans les données de remise.');
    return;
  }

  // Enregistrer la mise à jour via le backend
  this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
    () => {
      alert(
        `Remise appliquée :\nProduit : ${this.selectedProduct?.name ?? 'N/A'}\nPrix promo : ${this.selectedProduct?.pricePromo ?? 'N/A'} DH`
      );
      this.loadProducts(); // Rafraîchir les produits
      this.hideApplyDiscountPopup(); // Fermer le popup
    },
    (error) => {
      console.error('Erreur lors de l\'application de la remise :', error);
      alert('Erreur lors de l\'application de la remise.');
    }
  );
}

// Cacher le popup de remise
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
      categories: { id: 0, name: '', createdDate: '' },
      supplier: '',
      pricePromo:0,
      isPromo:false,
      productAddedDate:new Date(),
      expiredDate:new Date()
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
      categories: { id: 0, name: '', createdDate: '' },
      supplier: '',
      pricePromo:0,
      isPromo:false,
      productAddedDate:new Date(),
      expiredDate:new Date()
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
      product.categories,
      product.supplier,
      product.isPromo ? 'Oui' : 'Non',
      product.pricePromo,
      product.productAddedDate,
      product.expiredDate
    ].join(','));

    return [headers, ...rows].join('\n');
  }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadingCategories: boolean = false; // Indique si les catégories sont en cours de chargement
categoriesLoaded: boolean = false; // Indique si les catégories ont été chargées avec succès


addCategory(): void {
  if (!this.newCategory.name.trim()) {
    alert('Veuillez entrer un nom de catégorie valide.');
    return;
  }
}

  showAddCategoryPopup(): void {
    this.newCategoryName = ''; // Réinitialiser le champ
    this.showCategoryPopup = true;
  }

  hideAddCategoryPopup(): void {
    this.showCategoryPopup = false;
  }

}
