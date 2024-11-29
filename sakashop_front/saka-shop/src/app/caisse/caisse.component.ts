import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-caisse',
  standalone: false,
  
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.css'
})
export class CaisseComponent {
  products = [
    { id: 1, name: 'Produit Niveaa', price: 10},
    { id: 2, name: 'Produit chocolat', price: 20},
    { id: 3, name: 'Produit Pepsi', price: 30},
  ];
  constructor(private router: Router) {}
  searchQuery: string = '';
  filteredProducts = [...this.products]; // Liste filtrée basée sur la recherche

  cart: any[] = [];

  // Ajouter au panier
  addToCart(product: any): void {
    const found = this.cart.find((item) => item.id === product.id);
    if (found) {
      found.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  // Retirer du panier
  removeFromCart(item: any): void {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
    this.updateTotal();
  }

  // Filtrer les produits
  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Calculer le total
  calculateTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
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
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <h1 style="margin-bottom: 20px;">SAKA SHOP</h1>
      <h3>Bon de Commande</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #000; padding: 5px;">Produit</th>
            <th style="border-bottom: 1px solid #000; padding: 5px;">Quantité</th>
            <th style="border-bottom: 1px solid #000; padding: 5px;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${this.cart
            .map(
              (item) => `
              <tr>
                <td style="padding: 5px;">${item.name}</td>
                <td style="padding: 5px; text-align: center;">${item.quantity}</td>
                <td style="padding: 5px; text-align: right;">${item.price.toFixed(2)}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3 style="margin-top: 20px;">Total : ${this.calculateTotal().toFixed(2)} €</h3>
      <p>Merci de votre visite !</p>
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
