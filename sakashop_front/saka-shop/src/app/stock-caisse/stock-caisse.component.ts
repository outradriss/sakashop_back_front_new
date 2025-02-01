import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../service/product-service/product.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaisseStockService } from '../service/CaisseStock.service';

@Component({
  selector: 'app-stock-caisse',
  standalone: false,
  
  templateUrl: './stock-caisse.component.html',
  styleUrl: './stock-caisse.component.css'
})
export class StockCaisseComponent implements OnInit {
  @Output() stockSaved = new EventEmitter<any[]>(); 
  searchQuery: string = '';
  filteredProducts: Product[] = [];
  products: Product[] = [];
  selectedProducts: any[] = [];
  cachedProducts:Product[] = [];
  currentPage: number = 0;
  discountSearchQuery: string = '';
  discountFilteredProducts: Product[] = [];
  caisseName: string = '';

  constructor(private caisseStockService: CaisseStockService,private router: Router,private productService: ProductService, private cd: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadProducts();
    this.route.queryParams.subscribe((params) => {
      this.caisseName = params['caisseName'] || 'Inconnue';
    });
  //  // Récupérer les produits en cache via le state
  // const navigation = this.router.getCurrentNavigation();
  // const state = navigation?.extras.state as { cachedProducts: any[] };

  // if (state?.cachedProducts) {
  //   this.selectedProducts = state.cachedProducts; // Charger les produits en cache
  // } else {
  //   this.selectedProducts = []; // Si aucun produit en cache, initialisez un tableau vide
  // }
  }
// Filtrer les produits pour le popup de sélection
// Méthode pour filtrer les produits
filterDiscountProducts(): void {
  const query = this.discountSearchQuery.trim().toLowerCase();
  if (query.length > 0) {
    this.discountFilteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  } else {
    this.discountFilteredProducts = [];
  }
}

selectProduct(product: any): void {
  if (!this.selectedProducts.some((p) => p.itemCode === product.itemCode)) {
    this.selectedProducts.push({
      ...product,
      quantity: 1,
      buyPrice: product.buyPrice || 0,
      sellPrice: product.salesPrice || 0,
    });
  }
  this.discountSearchQuery = ''; // Réinitialise la recherche après sélection
  this.discountFilteredProducts = []; // Masque la liste des suggestions
}



  loadProducts(): void {
    if (this.cachedProducts.length > 0) {
      // Si les données sont déjà en cache, appliquez la pagination et le filtrage immédiatement
      this.applyFilter();
      return;
    }
  
    // Charger les données depuis le backend si non en cache
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.cachedProducts = [...data]; // Stocker les données dans le cache
        this.products = [...data]; // Initialiser les produits
        this.filteredProducts = [...this.products]; // Initialiser les produits filtrés

        this.applyFilter();
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }
  
  applyFilter(): void {
    // Appliquer le filtre de recherche
    if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase();
        const filtered = this.cachedProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(query) || // Filtrer par nom
                product.itemCode.toLowerCase().includes(query) // Filtrer par code produit
        );
    }
  }
// Filtrer les produits
filterProducts(): void {
  const query = this.searchQuery?.trim().toLowerCase() || ''; // Gère les cas où searchQuery est null ou undefined
  this.filteredProducts = this.products.filter((product) =>
    (product.name?.toLowerCase().includes(query) || false) || // Vérifie si product.name existe
    (product.itemCode?.toLowerCase().includes(query) || false) // Vérifie si product.itemCode existe
  );
}
  onSearch(): void {
    this.currentPage = 0; // Réinitialise à la première page pour une nouvelle recherche
    this.loadProducts();
}



  // Supprimer un produit de la liste des produits sélectionnés
  removeProduct(product: any): void {
    this.selectedProducts = this.selectedProducts.filter((p) => p.itemCode !== product.itemCode);
  }

  // Enregistrer les produits ajoutés
  saveStock(): void {
    console.log('Produits ajoutés:', this.selectedProducts);

    // Simuler le stockage et revenir au composant Gestion Caisse
    this.router.navigate(['/gestion-caisse'], {
      state: { selectedProducts: this.selectedProducts },
    });
  }

  // Annuler l'ajout
  cancel(): void {
    this.selectedProducts = [];
    this.searchQuery = '';
    this.filteredProducts = [];
  }
}