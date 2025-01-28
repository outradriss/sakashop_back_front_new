import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CaisseService } from '../service/product-service/caisse-service/caisse.service';
import Swal from 'sweetalert2';
import { SharedService } from '../service/shared.service';
import {jwtDecode} from 'jwt-decode';
import { LockService } from '../lock.service';
import { HistoryService } from '../service/product-service/history-service/history.service';
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
  cancelReason = '';
  isPopupVisibledelete=false;
  disableAllButtons: boolean = false;
  showButtons: boolean = true;
  userName:String = '';
  isPaymentPopupVisible: boolean = false;
 selectedPaymentMethod: string | null = null;
 isLocked: boolean = false;
  showPasswordInput: boolean = false;
  errorMessage: string = ''; 
  password: string = '';
  filteredSales: any[] = []; // Initialisation des ventes filtrées
  sales: any[] = [];
  totalSales: number = 0;


  constructor(private salesService: HistoryService,private lockService:LockService,private router: Router , private caisseService : CaisseService , private cdr: ChangeDetectorRef , private sharedService : SharedService) {}

  ngOnInit(): void {
    this.checkUserRole(); 
  this.loadProducts();
  this.retrieveUserInfo();

  // Vérifiez si la caisse est verrouillée
  const isLocked = localStorage.getItem('isLocked');
  this.isLocked = isLocked === 'true';

  this.sharedService.reloadCaisse$.subscribe(() => {
    this.loadProducts();
  });
  }

  lockCaisse(): void {
    this.isLocked = true;
    localStorage.setItem('isLocked', 'true'); // Sauvegarde l'état verrouillé; // Bloque l'accès
    
  }

  unlockCaisse(): void {
    this.caisseService.verifyPassword(this.password).subscribe(
      (isValid) => {
        if (isValid) {
          this.isLocked = false;
          this.showPasswordInput = false;
          this.password = '';
          this.errorMessage = '';
          localStorage.removeItem('isLocked'); // Supprime l'état verrouillé
        } else {
          this.errorMessage = 'Mot de passe incorrect';
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du mot de passe :', error);
        this.errorMessage = 'Mot de passe incorrect';
      }
    );
  }
  

  retrieveUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = decodedToken.sub || 'Utilisateur'; // Récupère le nom d'utilisateur depuis le token
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT:', error);
        this.userName = 'Utilisateur'; // Nom par défaut en cas d'erreur
      }
    } else {
      this.userName = 'Utilisateur'; // Nom par défaut si aucun token n'est trouvé
    }
  }

  checkUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const roles: string[] = decodedToken.roles || [];
        this.showButtons = !roles.includes('ROLE_EMPLOYEE'); // Cache les boutons si rôle "ROLE_EMPLOYEE"
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT:', error);
      }
    }
  }

  // Exemple d'utilisation pour désactiver les boutons
  isButtonDisabled(): boolean {
    return this.disableAllButtons;
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
        this.products = this.cachedProducts.slice(0, 27);
       // this.checkProductExpiration(); // Limite à 32 produits
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
  // Filtrer les produits ou ajouter au panier par code-barres
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
  
    if (query) {
      // Recherche par code-barres
      const foundProduct = this.cachedProducts.find((product) => product.itemCode === query);
  
      if (foundProduct) {
        // Ajouter directement au panier si le code-barres correspond
        this.addToCart(foundProduct);
        this.searchQuery = ''; // Réinitialiser le champ après ajout au panier
      } else {
        // Filtrer par nom si aucun produit ne correspond au code-barres
        this.filteredProducts = this.cachedProducts.filter((product) =>
          product.name.toLowerCase().includes(query)
        );
      }
    } else {
      // Réinitialiser la liste affichée si la recherche est vide
      this.filteredProducts = this.cachedProducts.slice(0, 27); // Affiche 27 produits
    }
  
    // Toujours afficher les 27 premiers produits si aucun produit n'est trouvé
    if (!this.filteredProducts.length) {
      this.filteredProducts = this.cachedProducts.slice(0, 27);
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
  
  openPaymentPopup(): void {
    this.isPaymentPopupVisible = true;
  }
  
  closePaymentPopup(): void {
    this.isPaymentPopupVisible = false;
    this.selectedPaymentMethod = null;
  }
  
  proceedPayment(): void {
    if (this.selectedPaymentMethod) {
      console.log('Méthode de paiement choisie :', this.selectedPaymentMethod);
      this.isPaymentPopupVisible = false;
      this.pay(); // Appelle la méthode de paiement principale
    }
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
          this.printReceipt();
          this.cart = []; // Réinitialisez le panier après la commande
          this.cachedProducts = [];
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
      this.showCancelPopupDelete(); // Afficher le popup de la cause
    }
  });
}

showCancelPopupDelete() {
  this.isPopupVisibledelete = true;
}

closeCancelPopupDelete() {
  this.isPopupVisibledelete = false;
  this.cancelReason = '';
}

submitCancel() {
  if (this.cancelReason.trim() === '') {
    Swal.fire('Erreur', 'Veuillez fournir une raison pour l\'annulation.', 'error');
    return;
  }
  // Récupérer le texte saisi et les produits annulés
  const cancellationInfo = {
    reason: this.cancelReason,
    itemId: this.cart.map(item => item.id)
  };

  // Envoyer les informations d'annulation au backend
  this.sendCancellationInfo(cancellationInfo);

  // Réinitialiser la valeur saisie et le panier
  this.cancelReason = '';
  this.cart.forEach((item) => (item.quantityInCart = 0)); // Réinitialiser les quantités dans le panier
  this.cart = [];
  this.updateTotal();
  this.closeCancelPopupDelete();
}

sendCancellationInfo(cancellationInfo: { reason: string; itemId: number[] }) {
  this.caisseService.sendCancellationInfo(cancellationInfo).subscribe(
    (response) => {
      console.log('Informations d\'annulation envoyées avec succès :', response);
    },
    (error) => {
      console.error('Erreur lors de l\'envoi des informations d\'annulation :', error);
    }
  );
}

showCancelPopup() {
  this.isPopupVisible = true;
}

closeCancelPopup() {
  this.isPopupVisible = false;
}

  
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
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
showPaymentPopup(): void {
  this.isPaymentPopupVisible = true;
}


confirmPayment(): void {
  if (!this.selectedPaymentMethod) {
    Swal.fire('Erreur', 'Veuillez sélectionner un mode de paiement.', 'error');
    return;
  }

  // Appeler la méthode pay pour effectuer le paiement
  this.pay();

  // Afficher un message de confirmation
  Swal.fire({
    title: 'Paiement confirmé',
    text: `Paiement effectué avec succès en ${this.selectedPaymentMethod === 'cash' ? 'Espèces' : this.selectedPaymentMethod === 'card' ? 'Carte' : 'Chèque'}.`,
    icon: 'success',
    confirmButtonText: 'OK'
  });

  // Réinitialiser l'état du popup
  this.isPaymentPopupVisible = false;
  this.selectedPaymentMethod = '';
}

printReceipt(): void {
  const receiptContent = `
    <div style="font-family: 'Courier New', monospace; width: 100%; margin: 0; padding: 0; text-align: left;">
      <!-- Entête -->
      <div style="text-align: center; margin-bottom: 10px;">
        <h2 style="margin: 0; font-size: 16px;">BAGGAGIO</h2>
        <p style="margin: 0; font-size: 12px;">Anfa Place</p>
        <p style="margin: 0; font-size: 12px;">Merci pour votre visite !</p>
        <hr style="border: 1px dashed #000; margin: 10px 0;">
      </div>
      
      <!-- Tableau des produits -->
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="text-align: left;">Produit</th>
            <th style="text-align: center;">Qté</th>
            <th style="text-align: right;">Prix (MAD)</th>
          </tr>
        </thead>
        <tbody>
          ${this.cart
            .map(
              (item) => `
              <tr>
                <td style="text-align: left;">${item.name}</td>
                <td style="text-align: center;">${item.quantityInCart}</td>
                <td style="text-align: right;">${item.salesPrice.toFixed(2)}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
      
      <!-- Total -->
      <hr style="border: 1px dashed #000; margin: 10px 10px;">
      <p style="font-size: 12px; text-align: right;">Total : <strong>${this.calculateTotal().toFixed(2)} MAD</strong></p>
      
      <!-- Message de fin -->
      <div style="text-align: center; margin-top: 10px; font-size: 12px;">
        <p>Merci de votre achat !</p>
        <p>À bientôt chez BAGGAGIO.</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
              font-size: 12px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${receiptContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}


closeCaisse(): void {
  this.loadSalesData(() => {
    const now = new Date();
    const openingDate = localStorage.getItem('caisseOpeningDate') || 'N/A';

    const ticketContent = `
      <div style="font-family: 'Courier New', monospace; text-align: left; padding: 10px; width: 100%;">
        <h2 style="text-align: center;">Caisse : BAGGAGIO</h2>
        <p style="text-align: center;">Dépot : BAGGAGIO</p>
        <hr style="border: 1px dashed #000;">
        <p>Fermée le : ${now.toLocaleString()}</p>
        <p>fond de caisse : ${this.totalSales.toFixed(2)} MAD</p>
        <hr style="border: 1px dashed #000;">
        <p style="text-align: center;">Merci et à bientôt !</p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Fermeture de caisse</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 0; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${ticketContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    localStorage.removeItem('caisseOpeningDate');
    this.router.navigate(['/open-caisse']);
  });
}



    // Charger les données depuis le backend
    loadSalesData(callback?: () => void): void {
      this.salesService.getSalesData().subscribe(
        (data) => {
          this.sales = data;
          const today = new Date();
          this.filteredSales = this.sales.filter((sale) => {
            const lastUpdated = new Date(sale.dateOrder);
            return (
              lastUpdated.getDate() === today.getDate() &&
              lastUpdated.getMonth() === today.getMonth() &&
              lastUpdated.getFullYear() === today.getFullYear()
            );
          });
  
          this.totalSales = this.filteredSales.reduce((sum, sale) => sum + sale.salesPrice, 0);
  
          if (callback) callback();
        },
        (error) => {
          console.error('Erreur lors du chargement des données :', error);
        }
      );
    }


}


