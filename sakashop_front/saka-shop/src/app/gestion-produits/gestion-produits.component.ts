import { Component } from '@angular/core';
import { Categories, Product } from '../models/product.model';
import { Route, Router } from '@angular/router';
import { ProductService } from '../service/product-service/product.service';
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
  currentPage: number = 0; // La page actuelle
  totalPages: number = 84; // Nombre total de pages (à mettre à jour dynamiquement)
  pageSize: number = 10;
  pagesToShow: number[] = []; // Pages affichées en tant que boutons
remainingPages: number[] = []; // Pages affichées dans le menu déroulant
  visiblePages: number[] = [];
  cachedProducts: Product[] = [];
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
updatePagination(): void {
  this.pagesToShow = [];
  this.remainingPages = [];

  // Afficher les 3 premières pages ou moins si le total est inférieur
  const totalPagesToShow = Math.min(3, this.totalPages);
  for (let i = 0; i < totalPagesToShow; i++) {
    this.pagesToShow.push(i);
  }

  // Ajouter les pages restantes au menu déroulant
  for (let i = 3; i < this.totalPages; i++) {
    this.remainingPages.push(i);
  }
}

// Appeler cette méthode après chaque chargement des produits
loadProducts(): void {
  if (this.cachedProducts.length > 0) {
    // Si les données sont déjà en cache, appliquez simplement la pagination et le filtrage
    this.applyPaginationAndFilter();
  } else {
    // Sinon, récupérer les données depuis le backend
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.cachedProducts = data; // Met toutes les données en cache
        this.products = [...this.cachedProducts]; // Initialise les produits
        this.filteredProducts = [...this.products]; // Initialise les produits filtrés
        this.totalPages = Math.ceil(this.cachedProducts.length / this.pageSize); // Calcule le nombre total de pages
        this.updatePagination(); // Met à jour les boutons de pagination
        this.loadCategoriesFromProducts(); // Extrait les catégories
        this.applyPaginationAndFilter(); // Applique la pagination et le filtrage
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }
}
disablePromo(product: Product): void {
  if (!product.isPromo) return;

  // Afficher une boîte de dialogue de confirmation avant de désactiver la promo
  Swal.fire({
    title: 'Confirmation',
    text: `Voulez-vous vraiment désactiver la promotion pour le produit : "${product.name}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, désactiver',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      // Si l'utilisateur confirme, désactiver la promo
      product.pricePromo = 0;
      product.isPromo = false;

      // Sauvegarder les modifications via le backend
      this.productService.updateProduct(product.id, product).subscribe(
        () => {
          Swal.fire({
            title: 'Succès',
            text: `La promotion pour le produit "${product.name}" a été désactivée avec succès.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.loadProducts(); // Rafraîchit la liste des produits
        },
        (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la désactivation de la promotion. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          console.error('Erreur lors de la désactivation de la promo :', error);
        }
      );
    } else {
      // L'utilisateur a annulé l'action
      Swal.fire({
        title: 'Action annulée',
        text: 'La promotion n\'a pas été désactivée.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
  });
}

disablePromoineditPopup(): void {
  if (this.productForms) {
    // Désactiver la promo localement
    this.productForms.isPromo = false;
    this.productForms.pricePromo = 0;

    // Envoyer la mise à jour au backend
    this.productService.updateProduct(this.productForms.id, this.productForms).subscribe(
      () => {
        Swal.fire({
          title: 'Promotion désactivée',
          text: 'La promotion a été désactivée pour ce produit. Vous pouvez maintenant modifier le prix de vente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Erreur lors de la désactivation de la promotion :', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur s\'est produite lors de la désactivation de la promotion. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}


applyPaginationAndFilter(): void {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;

  // Appliquer le filtre de recherche
  if (this.searchQuery.trim()) {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.cachedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) || // Filtrer par nom
        product.itemCode.toLowerCase().includes(query) // Optionnel : filtrer par code produit
    );
    this.filteredProducts = filtered.slice(startIndex, endIndex); // Appliquer la pagination sur les données filtrées
    this.totalPages = Math.ceil(filtered.length / this.pageSize); // Mettre à jour le nombre total de pages basé sur les données filtrées
  } else {
    // Pas de recherche : appliquer uniquement la pagination sur toutes les données
    this.filteredProducts = this.cachedProducts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.cachedProducts.length / this.pageSize);
  }

  this.updatePagination(); // Mettre à jour les boutons de pagination
}

// Gérer le changement de page via le menu déroulant
onPageChangeDropdown(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedValue = target?.value;
  if (selectedValue) {
    const page = parseInt(selectedValue, 10); // Convertir en entier
    if (!isNaN(page)) {
      this.currentPage = page;
      this.loadProducts(); // Recharger les produits pour la page sélectionnée
    }
  } else {
    console.error('Valeur sélectionnée invalide ou non définie');
  }
}


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
}

onSearch(): void {
    this.currentPage = 0; // Réinitialise à la première page pour une nouvelle recherche
    this.loadProducts();
}
  
// Filtrer les produits
filterProducts(): void {
  const query = this.searchQuery?.trim().toLowerCase() || ''; // Gère les cas où searchQuery est null ou undefined
  this.filteredProducts = this.products.filter((product) =>
    (product.name?.toLowerCase().includes(query) || false) || // Vérifie si product.name existe
    (product.itemCode?.toLowerCase().includes(query) || false) // Vérifie si product.itemCode existe
  );
}
calculatePagination(): void {
  this.visiblePages = [];
  this.remainingPages = [];
  // Ajouter la page précédente, actuelle et suivante comme boutons visibles
  for (let i = Math.max(0, this.currentPage - 1); i <= Math.min(this.currentPage + 1, this.totalPages - 1); i++) {
    this.visiblePages.push(i);
  }

  // Ajouter les autres pages au menu déroulant
  for (let i = 0; i < this.totalPages; i++) {
    if (!this.visiblePages.includes(i)) {
      this.remainingPages.push(i);
    }
  }
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
    this.productService.getAllProducts().subscribe(
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
    // Si le produit est déjà en promo, afficher un message d'avertissement avec une option pour continuer
    Swal.fire({
      title: 'Produit déjà en promotion',
      text: `Ce produit est déjà en promotion avec un prix promo de ${this.selectedProduct.pricePromo} DH. Voulez-vous appliquer une nouvelle remise ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, appliquer une nouvelle remise',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, ouvrir le popup pour appliquer une nouvelle remise
        this.discountPercentage = 0; // Réinitialiser le pourcentage de remise
        this.promoPrice = this.selectedProduct?.pricePromo || this.selectedProduct?.salesPrice || 0; 
        this.showDiscountPopup = false;
        this.showApplyDiscountPopup = true; // Afficher le popup pour la nouvelle remise
      } else {
        // Si l'utilisateur annule, ne rien faire
        this.selectedProduct = null;
      }
    });
  } else {
    // Si le produit n'est pas déjà en promotion, ouvrir directement le popup pour appliquer une remise
    this.discountPercentage = 0; // Réinitialiser le pourcentage de remise
    this.promoPrice = this.selectedProduct.salesPrice || 0;
    this.showDiscountPopup = false;
    this.showApplyDiscountPopup = true;
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
  // Vérifier si le nom de la catégorie est valide
  if (!this.newCategoryName.trim()) {
    alert('Veuillez entrer un nom de catégorie valide.');
    return;
  }

  // Créer un objet catégorie
  const newCategory: Categories = {
    id: 0, // Par défaut, on envoie 0 pour permettre au backend de générer un ID
    name: this.newCategoryName,
    createdDate: new Date().toISOString(), // Générer une date actuelle
  };

  // Appeler le service pour sauvegarder la catégorie
  this.productService.saveCategory(newCategory).subscribe(
    (savedCategory) => {
      alert(`Catégorie "${savedCategory.name}" ajoutée avec succès.`);
      this.categories.push(savedCategory); // Ajouter la nouvelle catégorie à la liste locale
      this.showCategoryPopup = false; // Fermer le popup d'ajout de catégorie
      this.newCategoryName = ''; // Réinitialiser le champ
    },
    (error) => {
      console.error('Erreur lors de l\'ajout de la catégorie :', error);
      alert('Erreur lors de l\'ajout de la catégorie.');
    }
  );
}


  showAddCategoryPopup(): void {
    this.newCategoryName = ''; // Réinitialiser le champ
    this.showCategoryPopup = true;
  }

  hideAddCategoryPopup(): void {
    this.showCategoryPopup = false;
  }


  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  

}
