import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-gestion-produits',
  standalone: false,
  
  templateUrl: './gestion-produits.component.html',
  styleUrl: './gestion-produits.component.css'
})
export class GestionProduitsComponent {
  products: Product[] = [
    { itemCode: '7640154260283', name: 'Marlboro', quantity: 10, buyPrice: 36.1, salesPrice: 38, category: 'Tabac', supplier: 'Unknown' },
    { itemCode: '80466437', name: 'Dove Stick bleu', quantity: 5, buyPrice: 19.5, salesPrice: 25, category: 'Cosmetics', supplier: 'Unknown' },
    // Ajoutez d'autres produits si nécessaire
  ];
  constructor(private router : Router){}
  filteredProducts: Product[] = [...this.products]; // Initialiser les produits filtrés
  searchQuery: string = ''; // Requête de recherche
  showPopup: boolean = false; // Contrôle du popup
  editingProduct: Product | null = null; // Produit en cours de modification
  productForm: Product = this.resetProductForm(); // Formulaire de produit

  // Filtrer les produits par recherche
  filterProducts(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.itemCode.toLowerCase().includes(query)
    );
  }
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }

  // Ouvrir le popup pour ajouter un produit
  showAddProductPopup(): void {
    this.showPopup = true;
    this.editingProduct = null;
    this.productForm = this.resetProductForm();
  }

  // Enregistrer un produit (ajout ou modification)
  saveProduct(): void {
    if (this.editingProduct) {
      // Modification
      const index = this.products.findIndex((p) => p.itemCode === this.editingProduct!.itemCode);
      if (index !== -1) {
        this.products[index] = { ...this.productForm };
      }
    } else {
      // Ajout
      this.products.push({ ...this.productForm });
    }
    this.filteredProducts = [...this.products]; // Mettre à jour les produits filtrés
    this.hidePopup();
  }

  // Modifier un produit
  editProduct(product: Product): void {
    this.showPopup = true;
    this.editingProduct = product;
    this.productForm = { ...product }; // Remplir le formulaire avec les données existantes
  }

  // Supprimer un produit
  deleteProduct(product: Product): void {
    this.products = this.products.filter((p) => p !== product);
    this.filteredProducts = [...this.products]; // Mettre à jour les produits filtrés
  }

  // Cacher le popup
  hidePopup(): void {
    this.showPopup = false;
    this.productForm = this.resetProductForm();
  }

  // Réinitialiser le formulaire de produit
  private resetProductForm(): Product {
    return {
      itemCode: '',
      name: '',
      quantity: 0,
      buyPrice: 0,
      salesPrice: 0,
      category: '',
      supplier: '',
    };
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
