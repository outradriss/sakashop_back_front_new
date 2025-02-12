import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CaisseService } from '../service/product-service/caisse-service/caisse.service';
import Swal from 'sweetalert2';
import { SharedService } from '../service/shared.service';
import {jwtDecode} from 'jwt-decode';
import { LockService } from '../lock.service';
import { HistoryService } from '../service/product-service/history-service/history.service';
import { switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SaleItem } from '../models/ItemSales.model';
import { OrderItem } from '../models/OrderItem.model';
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
  isPrinting: boolean=false;
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
  productNotFound: boolean = false;
  // Variables pour gérer le changement de produit
isChangeProductPopupOpen = false;
selectedProductToChange!: Product;
isOtherPaymentPopupOpen = false;
isCloseCaissePopupOpen: boolean = false;
// Variables pour Changer Produit
oldProductSearchQuery = '';
discountSearchQuery: string = '';
discountFilteredProducts: Product[] = [];
newProductSearchQuery = '';
filteredOldProducts: Product[] = [];
filteredNewProducts: Product[] = [];
selectedProducts: any[] = [];
selectedNewProduct: any | null = null;
priceDifference: number | null = null;
orderId: string = ''; // Stocke l'ID entré
foundOrder: any = null;
isOrderExpired: boolean = false;
selectedProductForDiscount: any = null;
typePaiement: string = '';
discountPercentage: number = 0;
discountedPrice: number = 0;
amountGiven: number = 0;
change: number = 0;
cashAmount: number = 0;
cardAmount: number = 0;
chequeAmount: number = 0;
remainingAmount: number = 0;

  constructor(private salesService: HistoryService,private lockService:LockService,private router: Router,private http:HttpClient , private caisseService : CaisseService , private cdr: ChangeDetectorRef , private sharedService : SharedService) {}

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
 // Ouvrir la liste des commandes
openSalesPopup(): void {
  this.loadSalesDataToday();
  this.isPopupVisible = true;
}

// Fermer la liste des commandes
closeSalesPopup(): void {
  this.isPopupVisible = false;
}
// ✅ Ouvrir le popup avec les ventes
openCloseCaissePopup(): void {
  this.loadSalesDataToday(() => {
    this.sales = [];

    // ✅ Décompacter les produits des commandes
    this.filteredSales.forEach(sale => {
      if (sale.items && sale.items.length > 0) {
        sale.items.forEach((item: { code: string, nameProduct: string, quantity: number, salesPrice: number, negoPrice: number, typePaiement: string }) => {
          
          let unitPrice = item.salesPrice; // ✅ Par défaut, on affiche le prix de vente
          let totalPrice = item.salesPrice * item.quantity; // ✅ Calcul du total par quantité

          if (item.negoPrice === -1) {
            unitPrice = 0; // ✅ Si negoPrice = -1, afficher 0 MAD
            totalPrice = 0; // ✅ Total aussi à 0
          } else if (item.negoPrice > 0) {
            unitPrice = item.negoPrice; // ✅ Si negoPrice > 0, afficher negoPrice
            totalPrice = item.negoPrice * item.quantity; // ✅ Calcul du total avec le prix négocié
          }

          this.sales.push({
            itemCode: item.code,
            itemName: item.nameProduct,
            quantity: item.quantity,
            salesPrice: totalPrice, // ✅ Afficher le prix total
            typePaiement: sale.typePaiement,
            promoLabel: item.negoPrice === -1 ? "(produit avec 100% de promo)" : "" // ✅ Ajout du label promo si -1
          });
        });
      }
    });

    this.isCloseCaissePopupOpen = true; // ✅ Afficher le popup
  });
}
calculateChange(): void {
  const total = this.calculateTotal();
  this.change = this.amountGiven - total;
}
resetCalculator(): void {
  this.amountGiven = 0; // Réinitialise le montant donné par le client
  this.change = 0; // Réinitialise la monnaie à rendre
}



calculateTotalSales(): number {
  return this.sales.reduce((sum, sale) => sum + (sale.salesPrice), 0);
}


getOrder(): void {
  if (!this.orderId.trim()) {
    alert("Veuillez entrer un ID de commande.");
    return;
  }

  this.caisseService.getOrder(this.orderId).subscribe(
    (data) => {
      this.foundOrder = data;

      if (this.foundOrder.items && this.foundOrder.items.length > 0) {
        const orderDate = new Date(this.foundOrder.items[0].dateCommande);
        const now = new Date();
        const diffInDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

        this.isOrderExpired = diffInDays > 3;

        // ✅ Stocke l'ID de commande principal (assure qu'il est bien défini)
        this.foundOrder.idOrderChange = this.foundOrder.idOrderChange 
          || (this.foundOrder.items.length > 0 ? this.foundOrder.items[0].idOrderChange : null);

        if (!this.foundOrder.idOrderChange) {
          console.warn("⚠️ Aucun idOrderChange trouvé dans la commande.");
        }

        // ✅ Vérification si le produit existe dans la commande
        this.productNotFound = !this.foundOrder.items.some(
          (item: OrderItem) => item.itemName === this.selectedProductToChange.name
        );
      }
    },
    (error) => {
      console.error("❌ Erreur lors de la récupération de la commande :", error);
      alert("Commande introuvable.");
      this.foundOrder = null;
      this.isOrderExpired = false;
      this.productNotFound = false;
    }
  );
}
  // ✅ Ouvrir le popup de remise
  openDiscountPopup(product: any): void {
    this.selectedProductForDiscount = product;
    this.discountPercentage = 0;
    this.discountedPrice = product.salesPrice; // Prix initial
  }

  // ✅ Calculer le prix après remise
  calculateDiscountedPrice(): void {
    if (this.selectedProductForDiscount) {
      const originalPrice = this.selectedProductForDiscount.salesPrice;
      this.discountedPrice = originalPrice - (originalPrice * (this.discountPercentage / 100));
    }
  }

  // ✅ Appliquer la remise et mettre à jour le prix dans le panier
  
  applyDiscount(): void {
    if (!this.selectedProductForDiscount) {
      return;
    }
  
    const product = this.selectedProductForDiscount;
  
    // ✅ Vérifier si la remise est de 100%
    const finalPrice = this.discountedPrice <= 0 ? -1 : this.discountedPrice;
  
    // ✅ Vérifier si le produit a plusieurs unités
    if (product.quantityInCart > 1) {
      Swal.fire({
        title: 'Remise sur plusieurs unités',
        text: `Vous avez ${product.quantityInCart} unités de ce produit. Que voulez-vous faire ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Appliquer à toutes les unités',
        cancelButtonText: 'Appliquer seulement à une unité',
        showDenyButton: true,
        denyButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ Appliquer la remise à toutes les unités
          product.negoPrice = finalPrice;
          Swal.fire('Succès', `Remise appliquée à toutes les unités (${product.quantityInCart}x).`, 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // ✅ Séparer une unité et appliquer la remise uniquement sur elle
          this.splitProductWithDiscount(product, finalPrice);
        }
        this.closeDiscountPopup();
      });
    } else {
      // ✅ Appliquer directement si une seule unité
      product.negoPrice = finalPrice;
      Swal.fire('Succès', 'Remise appliquée.', 'success');
      this.closeDiscountPopup();
    }
  }
  

  splitProductWithDiscount(product: Product, discountedPrice: number): void {
    if (product.quantityInCart! > 1) {
      product.quantityInCart!--; // ✅ Réduire la quantité du produit existant
  
      // ✅ Si la remise est de 100%, envoyer `negoPrice = -1`
      const negoPriceToSend = discountedPrice === 0 ? -1 : discountedPrice;
  
      // ✅ Créer une nouvelle ligne avec 1 unité et le prix réduit
      const discountedProduct = { 
        ...product, 
        quantityInCart: 1, 
        negoPrice: negoPriceToSend 
      };
  
      this.cart.push(discountedProduct); // ✅ Ajouter le produit avec remise
  
      Swal.fire('Succès', 'Une unité a été séparée avec la remise appliquée.', 'success');
      this.updateTotal();
    }
  }
  
  
  
  

  // ✅ Fermer le popup de remise
  closeDiscountPopup(): void {
    this.selectedProductForDiscount = null;
  }



  lockCaisse(): void {
    this.isLocked = true;
    localStorage.setItem('isLocked', 'true'); // Sauvegarde l'état verrouillé; // Bloque l'accès
    
  }
  selectProduct(product: any) {
    this.selectedNewProduct = product;
    this.calculatePriceDifference();
  
    // Réinitialiser la recherche et la liste des produits filtrés
    this.discountSearchQuery = '';
    this.discountFilteredProducts = [];
  }
  
  calculatePriceDifference() {
    if (this.selectedNewProduct && this.selectedProductToChange) {
      this.priceDifference = this.selectedNewProduct.salesPrice - this.selectedProductToChange.salesPrice;
    }
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
    const timestamp = new Date().getTime(); // Empêche le cache
    this.caisseService.getAllInCaisse({ params: { noCache: timestamp } }).subscribe(
      (data) => {
        this.cachedProducts = data; // Stocker les produits mis à jour
        this.products = this.cachedProducts.slice(0, 27);
        this.filteredProducts = this.products.map((product) => ({
          ...product,
          isPromo: product.isPromo,
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des produits :', error);
      }
    );
  }
  


  // Filtrer les produits ou ajouter au panier par code-barres
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
  
    if (query) {
      // Recherche par code-barres, nom ou code
      const foundProduct = this.cachedProducts.find(
        (product) => product.itemCode === query || product.code === query
      );
  
      if (foundProduct) {
        // Ajouter directement au panier si le code-barres ou le code correspond
        this.addToCart(foundProduct);
        this.searchQuery = ''; // Réinitialiser la recherche après l'ajout
      } else {
        // Filtrer par nom si aucun produit ne correspond au code-barres ou code
        this.filteredProducts = this.cachedProducts.filter((product) =>
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query)
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

  filterProductsChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
  
    if (query) {
      // Recherche par code-barres, nom ou code
      const foundProduct = this.cachedProducts.find(
        (product) => product.itemCode === query || product.code === query
      );
  
      if (foundProduct) {
        // Ajouter directement au panier si trouvé par code-barres/code
        this.addToCart(foundProduct);
        this.discountSearchQuery = ''; // Réinitialiser la recherche après l'ajout
        this.discountFilteredProducts = [];
      } else {
        // Filtrer par nom
        this.discountFilteredProducts = this.cachedProducts.filter((product) =>
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query)
        );
      }
    } else {
      // Réinitialiser la liste affichée si la recherche est vide
      this.discountFilteredProducts = [];
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
    this.resetCalculator();
  }
  
  proceedPayment(): void {
    if (this.selectedPaymentMethod) {
      console.log('Méthode de paiement choisie :', this.selectedPaymentMethod);
      this.isPaymentPopupVisible = false;
      this.pay(); // Appelle la méthode de paiement principale
    }
  }

  pay(): void {
    this.updateCartTotals();
  
    // ✅ Générer un code aléatoire pour la commande
    const orderCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // ✅ Construire les commandes avec les bons prix
    const orders = this.cart.map((product) => ({
      nameProduct: product.name,
      quantity: product.quantityInCart ?? 0,
      quantityAddedUrgent:
        (product.quantityInCart ?? 0) > product.quantity ? (product.quantityInCart ?? 0) - product.quantity : 0,
      isPromo: product.isPromo,
      salesPrice: product.salesPrice, // Prix normal stocké pour référence
      pricePromo: product.pricePromo, // Prix promo si applicable
      negoPrice: product.negoPrice, // Prix négocié si applicable
      totalePrice: (product.negoPrice > 0 
          ? product.negoPrice // Prix négocié s'il existe
          : product.isPromo 
          ? product.pricePromo // Prix promo si applicable
          : product.salesPrice) * (product.quantityInCart ?? 0), // ✅ Calcul du total
      dateOrder: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      itemId: product.id,
      id_order_change: orderCode, // ✅ Ajout du code commande
      comment: product.comment || '', // ✅ Ajout du commentaire
  
      // ✅ Gestion du paiement avec plusieurs méthodes
      cashAmount: this.cashAmount || 0,
      cardAmount: this.cardAmount || 0,
      chequeAmount: this.chequeAmount || 0,
  
      // ✅ Déterminer le mode de paiement en fonction des montants
      typePaiement: this.getPaymentType()
    }));
  
    // ✅ Envoi au backend
    this.caisseService.saveOrders(orders).pipe(
      switchMap(() => this.caisseService.getAllInCaisse({ params: { noCache: new Date().getTime() } }))
    ).subscribe(
      (data) => {
        Swal.fire(
          'Succès',
          `Votre commande a été enregistrée avec succès.\n\nCode commande : **${orderCode}**\nMode de paiement : **${this.getPaymentType()}**`,
          'success'
        );
        this.printReceipt(orderCode); // ✅ Impression du reçu avec le code commande
        this.resetPaymentFields(); // ✅ Réinitialisation des champs de paiement
        this.cart = []; // ✅ Réinitialisation du panier
        this.searchQuery = ''; 
        this.isOtherPaymentPopupOpen = false;
        this.ngOnInit(); // ✅ Recharge des produits
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de la commande :', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement de votre commande.', 'error');
      }
    );
  }

  
  resetPaymentFields(): void {
    this.cashAmount = 0;
    this.cardAmount = 0;
    this.chequeAmount = 0;
  }
  getPaymentType(): string {
    if (this.selectedPaymentMethod) {
      return this.selectedPaymentMethod; // ✅ Priorité au choix manuel
    }
  
    if (this.cashAmount > 0 && this.cardAmount > 0 && this.chequeAmount > 0) {
      return 'Mixte (Espèces + Carte + Chèque)';
    } else if (this.cashAmount > 0 && this.cardAmount > 0) {
      return 'Mixte (Espèces + Carte)';
    } else if (this.cashAmount > 0 && this.chequeAmount > 0) {
      return 'Mixte (Espèces + Chèque)';
    } else if (this.cardAmount > 0 && this.chequeAmount > 0) {
      return 'Mixte (Carte + Chèque)';
    } else if (this.cashAmount > 0) {
      return 'Espèces';
    } else if (this.cardAmount > 0) {
      return 'Carte';
    } else if (this.chequeAmount > 0) {
      return 'Chèque';
    } else {
      return 'Inconnu'; // ✅ Si aucun mode n'est sélectionné
    }
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

  // ✅ S'assurer que selectedPaymentMethod est utilisé avant pay()
  this.typePaiement = this.selectedPaymentMethod;

  // ✅ Exécuter `pay()`
  this.pay();

  // ✅ Afficher la confirmation après le paiement
  Swal.fire({
    title: 'Paiement confirmé',
    text: `Paiement effectué avec succès en ${this.selectedPaymentMethod === 'espèces' ? 'Espèces' : this.selectedPaymentMethod === 'carte' ? 'Carte' : 'Chèque'}.`,
    icon: 'success',
    confirmButtonText: 'OK'
  });

  // ✅ Réinitialiser après validation
  this.isPaymentPopupVisible = false;
  this.selectedPaymentMethod = ''; // ✅ Nettoyage
  this.resetCalculator();
}



printReceipt(orderCode: string): void {
  if (!this.cart || this.cart.length === 0) {
    alert("❌ Aucun produit dans le panier !");
    return;
  }

  const receiptContent = `
========================================
🏪           BAGGAGIO - Anfa Place        
        Merci pour votre visite !        
----------------------------------------
🛒   CODE COMMANDE :  ${orderCode}        
----------------------------------------
🛍️  PRODUITS ACHETÉS                     
----------------------------------------
Produit                 Qté       Prix  
----------------------------------------
${this.cart
    .map(
      (item) =>
        `${item.name.padEnd(20)} ${item.quantityInCart!.toString().padStart(3)}   ${item.salesPrice.toFixed(2).padStart(8)} MAD`
    )
    .join("\n")}
----------------------------------------
💰  TOTAL À PAYER :   ${this.calculateTotal().toFixed(2)} MAD     
----------------------------------------

💳  MODE DE PAIEMENT :
----------------------------------------
|      CARTE      |      ESPÈCE      |      CHÈQUE      |
|----------------|----------------|----------------|
|   ${this.cardAmount.toFixed(2).padStart(10)}   |   ${this.cashAmount.toFixed(2).padStart(10)}   |   ${this.chequeAmount.toFixed(2).padStart(10)}   |
----------------------------------------

📌  Merci de votre achat !               
📌  À bientôt chez BAGGAGIO.              
========================================
  `;

  if (!this.isPrinting) {
    this.isPrinting = true;

    // ✅ Envoi au backend pour impression
    this.http.post('http://localhost:8090/api/print/ticket', receiptContent, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log("✅ Reçu imprimé avec succès :", response);

          setTimeout(() => {
            this.isPrinting = false;
          }, 2000);
        },
        error: (error) => {
          console.error("❌ Erreur d'impression :", error);
          alert("Erreur d'impression. Vérifiez votre connexion au backend.");
          this.isPrinting = false;
        }
      });
  }
}



printAndClose(sale: any): void {
  this.printSaleReceipt(sale); // Appelle la méthode pour imprimer le reçu
  this.closeSalesPopup(); // Ferme le popup
}

printSaleReceipt(sale: any): void {
  if (!sale || !sale.items || sale.items.length === 0) {
    alert("❌ Aucune donnée de commande à imprimer !");
    return;
  }

  // ✅ Génération du contenu du reçu avec negoPrice
  const receiptContent = `
==============================

          BAGGAGIO - ANFA PLACE          
Merci pour votre visite !

------------------------------
Code Commande : ${sale.idOrderChange}

Date : ${new Date(sale.dateOrder).toLocaleString()}

------------------------------
Produit            Qté   Prix
------------------------------

${sale.items
  .map((item: SaleItem) => {
    let finalPrice = item.negoPrice > 0 
      ? item.negoPrice 
      : item.negoPrice === -1 
      ? 0 
      : item.salesPrice;

    let priceLabel = item.negoPrice === -1 
      ? "0 MAD (produit avec 100% de promo)" 
      : `${finalPrice.toFixed(2)} MAD`;

    return `${item.nameProduct.padEnd(20)} ${(item.quantity || 0).toString().padStart(3)}  ${priceLabel.padStart(8)}`;
  })
  .join("\n\n")} 

------------------------------
Total : ${sale.totalePrice.toFixed(2)} MAD

------------------------------

Merci de votre achat !
À bientôt chez BAGGAGIO.

==============================
  `;

  if (!this.isPrinting) {
    this.isPrinting = true;

    // ✅ Envoie le reçu au backend et attend la réponse avant de rediriger
    this.http.post('http://localhost:8090/api/print/ticket', receiptContent, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log("✅ Reçu imprimé avec succès :", response);

          setTimeout(() => {
            this.isPrinting = false;
          }, 2000);
        },
        error: (error) => {
          console.error("❌ Erreur d'impression :", error);
          alert("Erreur d'impression. Vérifiez votre connexion au backend.");
          this.isPrinting = false;
        }
      });
  }
}





closeCaisse(): void {
  this.totalSales = this.sales.reduce((total, sale) => total + sale.salesPrice * sale.quantity, 0);

  const now = new Date();
  const openingDate = localStorage.getItem('caisseOpeningDate') || 'N/A';
  const storedCashAmount = localStorage.getItem('cashAmount');
  const cashAmount = storedCashAmount ? parseFloat(storedCashAmount) : 0;
  const finalTotal = this.totalSales;

  // Fonction utilitaire pour découper les noms longs
  const formatProductName = (name: string, maxLength: number): string[] => {
    const lines: string[] = [];
    while (name.length > maxLength) {
      lines.push(name.slice(0, maxLength).trim()); // Découpe la ligne
      name = name.slice(maxLength).trim(); // Continue avec le reste
    }
    lines.push(name); // Ajoute le reste
    return lines;
  };

  // ✅ Construire la liste des produits vendus avec alignement des colonnes
  const productList = this.sales
    .map(sale => {
      const productLines = formatProductName(sale.itemName, 12); // Découpe le nom du produit
      const firstLine = `${sale.itemCode.padEnd(10)} | ${productLines[0].padEnd(12)} | ${sale.quantity
        .toString()
        .padStart(3)} | ${sale.salesPrice.toFixed(2).padStart(8)} MAD | ${sale.typePaiement.padEnd(10)}`;
      const additionalLines = productLines.slice(1).map(line => `             | ${line.padEnd(12)}`).join('\n'); // Indente les lignes suivantes
      return additionalLines ? `${firstLine}\n${additionalLines}` : firstLine;
    })
    .join('\n----------------------------------------------------------------\n'); // Ligne entre chaque produit

  // ✅ Génération du ticket
  const ticketContent = `
==============================

🏪 CAISSE : BAGGAGIO
📍 Dépot : BAGGAGIO

------------------------------
📅 Ouvert : ${openingDate}
📅 Fermé  : ${now.toLocaleString()}

------------------------------
💰 Fond initial : ${cashAmount.toFixed(2)} MAD
💵 Total ventes : ${this.totalSales.toFixed(2)} MAD

------------------------------
🔹 Liste des produits vendus :

Code Barre     | Produit      | Qté |   Prix    | M.Paiement
----------------------------------------------------------------

${productList}

----------------------------------------------------------------
🔹 Total final : ${finalTotal.toFixed(2)} MAD

------------------------------
Merci et à bientôt !

==============================
  `;

  if (!this.isPrinting) {
    this.isPrinting = true;

    // ✅ Envoi du ticket au backend
    this.http
      .post('http://localhost:8090/api/print/ticket', ticketContent, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('✅ Ticket envoyé au serveur :', response);

          // ✅ Suppression des données locales après impression
          localStorage.removeItem('caisseOpeningDate');
          localStorage.removeItem('cashAmount');

          // ✅ Redirection après impression terminée
          setTimeout(() => {
            this.isPrinting = false;
            this.router.navigate(['/open-caisse']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'impression :', error);
          alert('Erreur lors de l\'impression. Vérifiez votre connexion au backend.');
          this.isPrinting = false;
        },
      });
  }
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
    
    loadSalesDataToday(callback?: () => void): void {
      this.salesService.getSalesDataToday().subscribe(
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

    showChangeProductPopup(): void {
      if (this.cart.length === 0) {
        Swal.fire('Erreur', 'Votre panier est vide.', 'error');
        return;
      }
    
      // Sélectionne automatiquement le premier produit du panier
      this.selectedProductToChange = this.cart[0];
    
      this.isChangeProductPopupOpen = true;
    }

showOtherPaymentPopup(): void {
  this.isOtherPaymentPopupOpen = true;
}
cancelProductChange() {
  this.selectedNewProduct = null;
  this.priceDifference = null;
  this.discountSearchQuery = '';
  this.discountFilteredProducts = [];
  this.isChangeProductPopupOpen = false;
}
// Simule la recherche de produits (à adapter avec tes services)
filterOldProducts(): void {
  this.filteredOldProducts = this.cachedProducts.filter(product =>
    product.name.toLowerCase().includes(this.oldProductSearchQuery.toLowerCase())
  );
}

filterNewProducts(): void {
  const query = this.discountSearchQuery.trim().toLowerCase();
  if (query.length > 0) {
    this.discountFilteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  } else {
    this.discountFilteredProducts = [];
  }
}





confirmProductChange(): void {
  if (!this.selectedNewProduct || !this.selectedProductToChange) {
    Swal.fire('Erreur', 'Veuillez sélectionner un produit valide.', 'error');
    return;
  }

  console.log("🛠️ selectedNewProduct :", this.selectedNewProduct);
  console.log("🛠️ selectedProductToChange :", this.selectedProductToChange);

  // ✅ Vérifier que `itemCode` existe bien pour `selectedNewProduct`
  if (!this.selectedNewProduct.itemCode) {
    console.error("❌ ERREUR : `itemCode` du nouvel article est NULL ou UNDEFINED !");
    Swal.fire('Erreur', 'Le code du nouvel article est introuvable.', 'error');
    return;
  }

  // ✅ Vérifier que `itemCode` existe bien pour `selectedProductToChange`
  if (!this.selectedProductToChange.itemCode) {
    console.error("❌ ERREUR : `itemCode` de l'article à remplacer est NULL ou UNDEFINED !");
    Swal.fire('Erreur', 'Le code de l\'article à remplacer est introuvable.', 'error');
    return;
  }

  // ✅ Récupération de `idOrderChange`
  const orderCode = this.foundOrder?.idOrderChange 
    || (this.selectedNewProduct.items && this.selectedNewProduct.items.length > 0 
        ? this.selectedNewProduct.items[0].idOrderChange 
        : null);

  if (!orderCode) {
    Swal.fire('Erreur', 'Impossible de récupérer l\'ID de la commande.', 'error');
    return;
  }

  // ✅ Création de l'objet à envoyer au backend
  const productChangeData = {
    idOrderChange: orderCode, // ID de la commande
    newItemCode: this.selectedNewProduct.itemCode, // Code du nouvel article
    newNameProduct: this.selectedNewProduct.name, // Nom du nouveau produit
    oldItemCode: this.selectedProductToChange.itemCode, // Code de l'ancien article
    oldNameProduct: this.selectedProductToChange.name // Nom de l'ancien produit
  };

  console.log("📤 Données envoyées au backend :", productChangeData);

  // ✅ Envoi au backend (corrigé : suppression du tableau `[]`)
  this.caisseService.saveOrderChange(productChangeData).subscribe(
    () => {
      Swal.fire('Succès', `Le produit a été changé avec succès.\n\nCode commande : **${orderCode}**`, 'success');
      this.isChangeProductPopupOpen = false;
      this.loadProducts(); // Recharge les stocks en base
    },
    (error) => {
      console.error('❌ Erreur lors du changement de produit :', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors du changement de produit.', 'error');
    }
  );
}




calculateRemainingCardPayment(): void {
  const total = this.calculateTotal();
  this.cardAmount = total - this.cashAmount;
  if (this.cardAmount < 0) {
    this.cardAmount = 0;
  }
}

calculateRemainingPayment(): void {
  const totalGiven = (this.cashAmount || 0) + (this.cardAmount || 0) + (this.chequeAmount || 0);
  this.remainingAmount = this.calculateTotal() - totalGiven;
}





}


