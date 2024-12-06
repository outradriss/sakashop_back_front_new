import { ChangeDetectorRef, Component } from '@angular/core';
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
  alerts: { message: string; productId: number }[] = [];
  dismissedAlerts: Set<number> = new Set(); // Stocker les IDs des produits déjà alertés
  isPopupVisible = false;
  expiringProducts: { name: string; expiredDate: string; id: number }[] = []; // Liste des produits proches de l'expiration


  constructor(private router: Router , private caisseService : CaisseService , private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    this.checkProductExpiration();
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
        this.products = this.cachedProducts.slice(0, 32);
        this.checkProductExpiration(); // Limite à 32 produits
        this.filteredProducts = this.products.map((product) => ({
          ...product, // Conserve toutes les propriétés
          isPromo: product.isPromo, // Assure la copie de la propriété isPromo
          
        })); 
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
  
  calculateTotal(): number {
    return this.cart.reduce((total, product) => {
      // Priorité : isPromo > negoPrice > salesPrice
      const priceToUse = product.negoPrice > 0
        ? product.negoPrice
        : (product.isPromo ? product.pricePromo : product.salesPrice);
  
      // Calculer le total en fonction du prix et de la quantité
      return total + (priceToUse * (product.quantityInCart ?? 0));
    }, 0);
  }
  
  
  calculateProductTotal(product: any): number {
    // Utilisation de la méthode calculatePrice pour éviter les doublons
    const priceToUse = this.calculatePrice(product);
    return priceToUse * (product.quantityInCart ?? 0);
  }
  
  calculatePrice(product: any): number {
    // Priorité : negoPrice > pricePromo (si isPromo) > salesPrice
    if (product.negoPrice && product.negoPrice > 0) {
      return product.negoPrice;
    }
    if (product.isPromo && product.pricePromo > 0) {
      return product.pricePromo;
    }
    return product.salesPrice;
  }
  
  // Mise à jour des totaux et des prix négociés dans le panier
  updateCartTotals(): void {
    this.cart.forEach((product) => {
      product.totalePrice = this.calculateProductTotal(product); // Total pour chaque produit
    });
  }
  

  pay(): void {
    // Mise à jour des totaux dans le panier
    this.updateCartTotals();
  
    // Création des commandes pour chaque produit dans le panier
    const orders = this.cart.map((product) => ({
      nameProduct: product.name,
      quantity: product.quantityInCart ?? 0,
      quantityAddedUrgent:
        (product.quantityInCart ?? 0) > product.quantity ? (product.quantityInCart ?? 0) - product.quantity : 0,
      isPromo: product.isPromo,
      salesPrice: product.salesPrice,
      pricePromo: product.pricePromo,
      negoPrice: product.negoPrice,
      totalePrice: product.totalePrice, // Utilise le total calculé
      dateOrder: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      itemId: product.id
    }));
  
    // Envoi des commandes au backend
    this.caisseService.saveOrders(orders).subscribe(
      (response) => {
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
        console.error('Erreur lors de l\'enregistrement de la commande :', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement de votre commande.', 'error');
      }
    );
  }
    // Mettre à jour le total lorsque le prix change
    updateTotal(): void {
      this.calculateTotal();
    }

    showPopup(): void {
      this.isPopupVisible = true;
    }
    
    closePopup(): void {
      this.isPopupVisible = false;
    }
 
  // Annuler la commande
  cancel(): void {
    Swal.fire({
      title: 'Annuler la commande',
      text: 'Êtes-vous sûr de vouloir annuler la commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, continuer',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Commande annulée', 'Votre commande a été annulée avec succès.', 'success');
        this.cart.forEach((item) => (item.quantityInCart = 0)); // Réinitialiser les quantités dans le panier
        this.cart = [];
        this.updateTotal(); 
      }
    });
  }
  
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  checkProductExpiration(): void {
    const today = new Date(); // Aujourd'hui
    const thresholdDate = new Date(); // Date limite (14 jours)
    thresholdDate.setDate(today.getDate() + 14);
  
    // Liste des produits concernés
    const expiringProducts: { name: string; expiredDate: string; id: number }[] = [];
  
    this.cachedProducts.forEach((product) => {
      if (product.expiredDate) {
        const expiredDate = new Date(product.expiredDate);
  
        // Vérifie si la date est valide et tombe dans l'intervalle
        if (expiredDate > today && expiredDate <= thresholdDate) {
          // Vérifie si une alerte pour ce produit a déjà été ignorée
          if (!this.dismissedAlerts.has(product.id)) {
            expiringProducts.push({
              name: product.name,
              expiredDate: expiredDate.toLocaleDateString(),
              id: product.id,
            });
          }
        }
      }
    });
  
    // Génère un message global uniquement si des produits expirants sont trouvés
    if (expiringProducts.length > 0) {
      const count = expiringProducts.length;
  
      // Génère une alerte globale sans inclure directement les produits (évite l'erreur de typage)
      this.alerts = [
        {
          message: `Attention, il y a ${count} produit${count > 1 ? 's' : ''} dont la date d'expiration est proche. Cliquez sur "En savoir +" pour voir la liste complète.`,
          productId: -1, // Utilisez une valeur fictive si nécessaire
        },
      ];
  
      // Conservez les produits expirants pour les afficher dans un popup ou autre
      this.expiringProducts = expiringProducts; // Assurez-vous que `expiringProducts` existe dans la classe
    } else {
      this.alerts = []; // Pas d'alertes si aucun produit concerné
    }
  
    this.cdr.detectChanges(); // Forcer la mise à jour de l'affichage
  }
  
  
  // Fermer l'alerte
  dismissAlert(alert: { message: string; productId: number }): void {
    this.alerts = this.alerts.filter((a) => a.productId !== alert.productId);
    this.dismissedAlerts.add(alert.productId); // Empêche l'affichage futur de cette alerte
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


