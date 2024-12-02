import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CaisseService } from '../service/product-service/caisse-service/caisse.service';
import Swal from 'sweetalert2';
import { DisplayProduct } from '../models/DisplayProductInCaisse.model.service';

@Component({
  selector: 'app-caisse',
  standalone: false,
  
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.css'
})
export class CaisseComponent {

  cachedProducts: Product[] = []; // Tous les produits en cache
  filteredProducts: Product[] = []; // Produits affichés
  products: Product[] = []; // Tous les produits (limités à 32 pour affichage initial)
  cart: Product[] = []; // Panier
  searchQuery: string = '';

  constructor(private router: Router , private caisseService : CaisseService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Ajouter au panier
  addToCart(product: Product): void {
    const foundInCart = this.cart.find((item) => item.id === product.id);

    if (foundInCart) {
      // Vérifie le stock
      if ((foundInCart.quantityInCart ?? 0) + 1 > product.quantity) {
        Swal.fire({
          title: 'Stock insuffisant',
          text: `Vous n'avez que ${product.quantity} en stock. Voulez-vous ajouter ce produit en tant que commande urgente ?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, ajouter',
          cancelButtonText: 'Non',
        }).then((result) => {
          if (result.isConfirmed) {
            foundInCart.quantityInCart! += 1; // Ajoute même si stock insuffisant
            this.updateTotal();
            Swal.fire({
              title: 'Produit ajouté',
              text: 'Le produit a été ajouté en tant que commande urgente.',
              icon: 'success',
            });
          }
        });
      } else {
        foundInCart.quantityInCart! += 1; // Ajout normal
        this.updateTotal();
      }
    } else {
      // Ajoute un nouveau produit au panier
      this.cart.push({ ...product, quantityInCart: 1 });
      this.updateTotal();
    }
  }
  
  
  increaseQuantity(item: Product): void {
    if ((item.quantityInCart ?? 0) + 1 > item.quantity) {
      Swal.fire({
        title: 'Stock insuffisant',
        text: `Vous n'avez que ${item.quantity} en stock. Voulez-vous ajouter quand même ce produit comme commande urgente ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, ajouter',
        cancelButtonText: 'Non',
      }).then((result) => {
        if (result.isConfirmed) {
          item.quantityInCart = (item.quantityInCart ?? 0) + 1;
          this.updateTotal();
          Swal.fire({
            title: 'Produit ajouté',
            text: 'Le produit a été ajouté en tant que commande urgente.',
            icon: 'success',
          });
        }
      });
    } else {
      item.quantityInCart = (item.quantityInCart ?? 0) + 1;
      this.updateTotal();
    }
  }
  
  
  
  decreaseQuantity(item: Product): void {
    if (item.quantityInCart! > 1) {
      item.quantityInCart!--;
    } else {
      this.removeFromCart(item);
    }
    this.updateTotal();
  }

  removeFromCart(item: Product): void {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
    this.updateTotal();
  }
  loadProducts(): void {
    this.caisseService.getAllInCaisse().subscribe(
      (data) => {
        this.cachedProducts = data; // Stocke toutes les données des produits
        this.products = this.cachedProducts.slice(0, 32); // Limite à 32 produits
        this.filteredProducts = this.products.map((product) => ({
          ...product, // Conserve toutes les propriétés
          isPromo: product.isPromo, // Assure la copie de la propriété isPromo
        })); // Prépare les données pour l'affichage limité
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }


  // Filtrer les produits
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.filteredProducts = this.cachedProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredProducts = this.cachedProducts.slice(0, 32);
    }
  }
  
  validateCartPrice(product: any): void {
    // Vérifie si le prix dans le panier est valide selon la promo ou le prix de vente
    if (product.isPromo) {
      if (product.negoPrice <= product.buyPrice) {
        console.error(`Erreur : Le prix pour ${product.name} est inférieur au prix promo.`);
      }
    } else {
      if (product.negoPrice <= product.buyPrice) {
        console.error(`Erreur : Le prix pour ${product.name} est inférieur au prix de vente.`);
      }
    }
  }
  
  isPayButtonDisabled(): boolean {
    // Désactive le bouton si un produit a un prix invalide
    return this.cart.some(product =>
      product.isPromo
        ? product.negoPrice < product.buyPrice
        : product.negoPrice < product.buyPrice
    );
  }
  
  
  // Calculer le total
  calculateTotal(): number {
    return this.cart.reduce((total, item) => {
      const priceToUse = item.negoPrice ?? (item.isPromo ? item.pricePromo : item.salesPrice);
      return total + priceToUse * (item.quantityInCart ?? 0);
    }, 0);
  }
  

  // Mettre à jour le total lorsque le prix change
  updateTotal(): void {
    this.calculateTotal();
  }

  // Paiement
  pay(): void {
    const orders = this.cart.map((product) => ({
      nameProduct: product.name,
      quantity: product.quantityInCart ?? 0,
      quantityAddedUrgent: (product.quantityInCart ?? 0) > product.quantity ? (product.quantityInCart ?? 0) - product.quantity : 0,
      isPromo: product.isPromo,
      salesPrice: product.salesPrice,
      pricePromo: product.pricePromo,
      dateOrder: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      itemId: product.id
    }));
  
    this.caisseService.saveOrders(orders).subscribe(
      (response) => {
        // Vérifiez si la réponse contient une erreur
        if (response?.status === 'error') {
          Swal.fire('Erreur', response.message || 'Une erreur est survenue.', 'error');
        } else {
          Swal.fire('Succès', 'Votre commande a été enregistrée avec succès.', 'success');
          this.cart = []; // Réinitialisez le panier après la commande
          this.cachedProducts = [];
          this.printReceipt();
          this.loadProducts();
        }
      },
      (error) => {
        // Gestion des erreurs HTTP
        console.error('Erreur lors de l\'enregistrement de la commande :', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement de votre commande.', 'error');
      }
    );
  }
  
  

  // Annuler la commande
  cancel(): void {
    if (confirm('Voulez-vous annuler cette commande ?')) {
      this.cart.forEach((item) => (item.quantityInCart = 0)); // Réinitialiser les quantités dans le panier
      this.cart = [];
      this.updateTotal(); 
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


