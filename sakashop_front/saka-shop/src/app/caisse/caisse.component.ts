import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CaisseService } from '../service/product-service/caisse-service/caisse.service';
import { DisplayProduct } from '../models/DisplayProductInCaisse.model.service';

@Component({
  selector: 'app-caisse',
  standalone: false,
  
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.css'
})
export class CaisseComponent {
  cachedProducts: Product[] = [];
  constructor(private router: Router , private caisseService : CaisseService) {}
  searchQuery: string = '';
  filteredProducts: DisplayProduct[] = []; 
  products: Product[] = [];

  cart: { name: string; salesPrice: number; quantity: number }[] = [];

  // Ajouter au panier
  addToCart(product: { name: string; salesPrice: number }): void {
    const existingProduct = this.cart.find((item) => item.name === product.name);
  
    if (existingProduct) {
      existingProduct.quantity += 1; // Augmente la quantité si le produit existe déjà
    } else {
      this.cart.push({ ...product, quantity: 1 }); // Ajoute un nouveau produit avec une quantité initiale de 1
    }
  
    this.updateTotal(); // Met à jour le total
  }
  increaseQuantity(item: any): void {
    item.quantity += 1; // Augmente la quantité
    this.updateTotal(); // Met à jour le total
  }
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1; // Réduit la quantité si elle est supérieure à 1
    } else {
      this.removeFromCart(item); // Supprime le produit si la quantité atteint 0
    }
    this.updateTotal(); // Met à jour le total
  }

  // Retirer du panier
  removeFromCart(item: any): void {
    this.cart = this.cart.filter((cartItem) => cartItem.name !== item.name); 
    this.updateTotal(); 
  }
  loadProducts(): void {
    this.caisseService.getAllInCaisse().subscribe(
      (data) => {
        this.cachedProducts = data; // Stocke toutes les données des produits
        this.products = this.cachedProducts.slice(0, 32); // Affiche uniquement les 12 premiers produits
        this.filteredProducts = this.products.map((product) => ({
          name: product.name,
          salesPrice: product.salesPrice,
        })); // Prépare les données pour l'affichage limité
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  

  // Filtrer les produits
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
  
    // Si une recherche est effectuée
    if (query) {
      this.filteredProducts = this.cachedProducts
        .filter((product) => product.name.toLowerCase().includes(query))
        .map((product) => ({
          name: product.name,
          salesPrice: product.salesPrice,
        }));
    } else {
      // Si aucune recherche, afficher les 12 premiers produits
      this.filteredProducts = this.cachedProducts.slice(0, 32).map((product) => ({
        name: product.name,
        salesPrice: product.salesPrice,
      }));
    }
  }
  
  

  // Calculer le total
  calculateTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.salesPrice * item.quantity,
      0
    );
  }

  // Mettre à jour le total lorsque le prix change
  updateTotal(): void {
    this.calculateTotal();
  }

  // Paiement
  pay(): void {
    if (confirm('Voulez-vous imprimer le ticket ?')) {
      alert('Paiement effectué avec succès et impression en cours...');
      this.cart = [];
    } else {
      alert('Paiement effectué sans impression.');
      this.cart = [];
    }
  }

  // Annuler la commande
  cancel(): void {
    if (confirm('Voulez-vous annuler cette commande ?')) {
      this.cart = [];
      this.updateTotal(); // Met à jour le total
    }
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
  isModalOpen: boolean = false;

openModal(): void {
  this.isModalOpen = true;
}

closeModal(): void {
  this.isModalOpen = false;
}

confirmPayment(): void {
  this.printReceipt(); // Imprime le bon
  this.isModalOpen = false;
  this.cart = []; // Vide le panier après le paiement
  alert('Paiement confirmé et bon imprimé !');
}

printReceipt(): void {
  const receiptContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; color: #000; border: 1px solid #000; width: 80%; margin: auto;">
      <!-- Logo -->
      <div style="margin-bottom: 20px;">
        <img src="/logos/logo.png" alt="SAKA SHOP Logo" style="max-width: 100px; margin: 0 auto;" />
      </div>
      <!-- Titre principal -->
      <h1 style="margin-bottom: 10px; font-size: 24px; text-transform: uppercase;">SAKA SHOP</h1>
      <h3 style="margin-bottom: 20px; font-size: 18px;">Bon de Commande</h3>
      
      <!-- Ligne séparatrice -->
      <hr style="border: 1px solid #000; margin: 10px 0;" />
      
      <!-- Tableau des produits -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="border: 1px solid #000; padding: 10px; text-align: left;">Produit</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center;">Quantité</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: right;">Prix (€)</th>
          </tr>
        </thead>
        <tbody>
          ${this.cart
            .map(
              (item) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: left;">${item.name}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${item.salesPrice.toFixed(2)}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>

      <!-- Total -->
      <h3 style="margin-top: 20px; text-align: right; font-size: 18px;">Total : ${this.calculateTotal().toFixed(2)} €</h3>

      <!-- Message de fin -->
      <p style="margin-top: 20px; font-size: 14px;">Merci de votre visite !</p>
      <p style="font-size: 12px;">À bientôt chez <strong>SAKA SHOP</strong>.</p>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande</title>
        </head>
        <body onload="window.print(); window.close();">
          ${receiptContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

 
}


