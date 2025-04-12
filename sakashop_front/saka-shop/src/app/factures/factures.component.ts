import { Component } from '@angular/core';
import { ProductService } from '../service/product-service/product.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { FactureService } from '../service/facture.service';


@Component({
  selector: 'app-factures',
  standalone: false,
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.css'
})
export class FacturesComponent {
  formPopup: boolean = false; // false = fermé, true = ouvert
  selectedPayment: string = ''; // Type de paiement sélection
  produits: { nom: string, quantite: number, prix: number }[] = [];
  cachedProducts: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = ''; 
  produitsSelectionnes: { produit: Product, quantite: number }[] = []; // ✅ Ajout de la propriété
  discountFilteredProducts: Product[] = [];
  discountSearchQuery: string = '';
  currentPage: number = 0;
  totalPages: number = 84; // Nombre total de pages (à mettre à jour dynamiquement)
  pageSize: number = 10;
  factureReference: string = '';
  factures: any[] = [];
  clientICE: string = '';
  clientName: string = '';
  totalHT: number = 0;
  totalTVA: number = 0;
  totalTTC: number = 0;
  clientCode: string = '';
  adresse: string = '';
  entreprise: string = '';
  dateFacture: string = '';
  dateEcheance: string = '';
  modePaiement: string = '';
  statusPaiement: string = '';
  factureSelectionnee: any = null;
  isEditMode: boolean = false;
  constructor(private productService: ProductService , private cdRef: ChangeDetectorRef , private factureService : FactureService)  { }

  ngOnInit() {
    this.loadProducts();
    console.log('Produits chargés:', this.products);
    this.chargerFactures();

  }
  openForm(): void {
    this.isEditMode = false; // Mode création
    this.factureReference = this.generateFactureReference();
    this.clientName = '';
    this.clientICE = '';
    this.clientCode = '';
    this.adresse = '';
    this.entreprise = '';
    this.dateFacture = '';
    this.dateEcheance = '';
    this.modePaiement = '';
    this.statusPaiement = '';
    this.produitsSelectionnes = []; // Vider la liste des produits
    this.formPopup = true;
  }
  
  
  generateFactureReference(): string {
    const currentYear = new Date().getFullYear();
    const lastNumber = this.getLastInvoiceNumber() + 1; // Numéro qui s'incrémente
    return `FAC-${currentYear}-${lastNumber.toString().padStart(3, '0')}`;
  }
  
  getLastInvoiceNumber(): number {
    if (this.factures.length === 0) {
      return 0; // Première facture de l'année
    }
    const lastFacture = this.factures[this.factures.length - 1];
    const match = lastFacture.reference.match(/FAC-\d{4}-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ✅ Fermer la popup
  closeForm() {
    this.formPopup = false;
  }
  selectPayment(paymentType: string) {
    this.selectedPayment = paymentType;
  }
  loadProducts(): void {
    if (this.cachedProducts.length > 0) {
      // Si les données sont déjà en cache, appliquez la pagination et le filtrage immédiatement
      return;
    } 
    // Charger les données depuis le backend si non en cache
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.cachedProducts = [...data]; // Stocker les données dans le cache
        this.products = [...data]; // Initialiser les produits
        this.filteredProducts = [...this.products]; // Initialiser les produits filtrés
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }


  filterDiscountProducts(): void {
    const query = this.discountSearchQuery?.trim().toLowerCase();
    this.discountFilteredProducts = this.products.filter((product) =>
      (product.name?.toLowerCase() || '').includes(query) ||
      (product.itemCode?.toLowerCase() || '').includes(query) ||
      (product.code?.toLowerCase() || '').includes(query)
    );
  }
  
  
  
  selectProduct(product: Product): void {
    this.produitsSelectionnes.push({ produit: product, quantite: 1 });
    this.discountSearchQuery = ''; // Réinitialiser la barre de recherche
    this.discountFilteredProducts = []; // Cacher la liste après sélection
}
checkStock(item: any): void {
  if (item.quantite > item.produit.stock) {
      item.quantite = item.produit.stock; // Limite la quantité au stock disponible
  }
}


  removeProduct(index: number): void {
    this.produitsSelectionnes.splice(index, 1);
  }
  calculTotal(): number {
    return this.produitsSelectionnes.reduce((total, item) => {
      const prixHT = Number(item.produit.buyPrice) || 0;
      const tva = Number(item.produit.tva) || 0;
      const prixTTC = prixHT + (prixHT * tva / 100);
      return total + (item.quantite * prixTTC);
    }, 0);
  }
  

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


generateInvoiceAndPrint(): void {
  if (this.isEditMode) {
    this.updateFacture();
  } else {
    this.envoyerFacture();
  }

  const dateProposition = new Date();
  const dateFinValidite = new Date(dateProposition);
  dateFinValidite.setMonth(dateFinValidite.getMonth() + 1);

  // Calculs avec prix H.T. + TVA
  let totalHT = this.produitsSelectionnes.reduce((total, item) => {
    const ht = Number(item.produit.buyPrice) || 0;
    return total + item.quantite * ht;
  }, 0);

  let totalTVA = this.produitsSelectionnes.reduce((total, item) => {
    const ht = Number(item.produit.buyPrice) || 0;
    const tva = Number(item.produit.tva) || 0;
    return total + item.quantite * ht * tva / 100;
  }, 0);

  let totalTTC = totalHT + totalTVA;

  const totalRows = 30;
  const filledRows = this.produitsSelectionnes.length;
  const emptyRows = Math.max(0, totalRows - filledRows);

  const invoiceHTML = `
    <html>
      <head>
        <title>Facture</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fff; color: #000; width: 210mm; height: 297mm; }
          .invoice-container { width: 190mm; height: 277mm; margin: auto; padding: 15mm; background: #fff; display: flex; flex-direction: column; box-sizing: border-box; }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
          .invoice-header img { max-height: 200px; }
          .invoice-header div { text-align: right; }
          .invoice-header h2 { margin: 0; font-size: 14px; color: #000; }
          .invoice-info { display: flex; justify-content: space-between; gap: 10mm; margin-bottom: 10px; }
          .invoice-info div { padding: 5px; border: 1px solid #000; width: 48%; background: #f2f2f2; font-size: 10px; }
          .invoice-info strong { display: block; font-size: 11px; }
          .invoice-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
          .invoice-table-container { flex-grow: 1; display: flex; flex-direction: column; padding: 5px; }

          .invoice-table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; border: 1px solid #000; }

          .invoice-table th, .invoice-table td { padding: 5px; text-align: center; font-size: 10px; vertical-align: middle; border-left: 1px solid #000; border-right: 1px solid #000; }

          .invoice-table th { background: #000; color: #fff; text-transform: uppercase; border-top: 1px solid #000; border-bottom: 1px solid #000; }

          .invoice-table td { border-bottom: none; }

          .invoice-table th:nth-child(1), .invoice-table td:nth-child(1) { width: 50%; }
          .invoice-table th:nth-child(2), .invoice-table td:nth-child(2) { width: 10%; }
          .invoice-table th:nth-child(3), .invoice-table td:nth-child(3) { width: 15%; }
          .invoice-table th:nth-child(4), .invoice-table td:nth-child(4) { width: 10%; }
          .invoice-table th:nth-child(5), .invoice-table td:nth-child(5) { width: 15%; }

          .invoice-total { text-align: right; padding-top: 5px; font-size: 10px; font-weight: bold; border-top: 1px solid #000; margin-top: auto; }
          .invoice-total p { margin: 2px 0; }
          .invoice-total .total { font-size: 12px; font-weight: bold; background: #000; color: #fff; padding: 3px; display: inline-block; }

          @media print {
            .invoice-container { width: 210mm; height: 297mm; }
            .invoice-table th { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .invoice-total .total { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class='invoice-container'>
          <div class='invoice-header'>
            <img src='/logos/BAGGAGIO.png' alt='BAGGAGIO'>
            <div>
              <h2>Proposition ${this.factureReference}</h2>
              <p>Date de proposition : ${dateProposition.toLocaleDateString()}</p>
              <p>Date de fin de validité : ${dateFinValidite.toLocaleDateString()}</p>
              <p>Code client : ${this.clientCode}</p>
            </div>
          </div>
          <div class='invoice-info'>
            <div>
              <strong>Émetteur</strong>
              <p>BAGGAGIO</p>
              <p>Rue 107, N°31 Boulevard Oued Sbou Hay Oulfa, 22200 Casablanca</p>
              <p>Tél.: 0667747180</p>
              <p>Email: mekka.technologie@gmail.com</p>
            </div>
            <div>
              <strong>Adressé à</strong>
              <p>${this.clientName}</p>
              <p>ICE: ${this.clientICE}</p>
            </div>
          </div>
          <div class='invoice-content'>
            <div class='invoice-table-container'>
              <table class='invoice-table'>
                <thead>
                  <tr>
                    <th>DÉSIGNATION</th>
                    <th>TVA</th>
                    <th>P.U. HT</th>
                    <th>QTÉ</th>
                    <th>TOTAL HT</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    this.produitsSelectionnes.map((item) => {
                      const ht = Number(item.produit.buyPrice) || 0;
                      const tva = Number(item.produit.tva) || 0;
                      const totalHTProduit = item.quantite * ht;
                      return `
                        <tr>
                          <td>${item.produit.name}</td>
                          <td>${tva}%</td>
                          <td>${ht.toFixed(2)} MAD</td>
                          <td>${item.quantite}</td>
                          <td>${totalHTProduit.toFixed(2)} MAD</td>
                        </tr>
                      `;
                    }).join('')
                  }
                  ${
                    Array(emptyRows).fill(`<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('')
                  }
                </tbody>
              </table>
            </div>
            <div class='invoice-total'>
              <p>Total HT: ${totalHT.toFixed(2)} MAD</p>
              <p>Total TVA: ${totalTVA.toFixed(2)} MAD</p>
              <p class='total'>TOTAL TTC: ${totalTTC.toFixed(2)} MAD</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  }

  this.closeForm();
}





envoyerFacture(): void {
  if (this.produitsSelectionnes.length === 0) {
    alert("Ajoutez au moins un produit avant d'envoyer la facture !");
    return;
  }

  if (!this.clientName || !this.clientICE || !this.clientCode || !this.adresse || !this.entreprise) {
    alert("Veuillez remplir toutes les informations du client !");
    return;
  }

  const totalHT = this.produitsSelectionnes.reduce((total, item) => {
    const ht = Number(item.produit.buyPrice) || 0;
    return total + item.quantite * ht;
  }, 0);

  const totalTVA = this.produitsSelectionnes.reduce((total, item) => {
    const ht = Number(item.produit.buyPrice) || 0;
    const tva = Number(item.produit.tva) || 0;
    return total + item.quantite * ht * tva / 100;
  }, 0);

  const totalTTC = totalHT + totalTVA;

  const factureData = {
    reference: this.factureReference,
    clientName: this.clientName,
    clientICE: this.clientICE,
    clientCode: this.clientCode,
    adresse: this.adresse,
    entreprise: this.entreprise,
    dateFacture: this.dateFacture ? new Date(this.dateFacture).toISOString().split('T')[0] : null,
    dateEcheance: this.dateEcheance ? new Date(this.dateEcheance).toISOString().split('T')[0] : null,
    modePaiement: this.modePaiement,
    statusPaiement: this.statusPaiement,
    itemQuantities: this.produitsSelectionnes.map(item => {
      const ht = Number(item.produit.buyPrice) || 0;
      const tva = Number(item.produit.tva) || 0;
      const prixTTC = ht + (ht * tva / 100);
      return {
        id: item.produit.id,
        quantity: item.quantite,
        prixHT: ht,
        tva,
        prixTTC,
        totalTTC: item.quantite * prixTTC
      };
    }),
    totalHT,
    totalTVA,
    totalTTC
  };

  console.log("Données envoyées :", factureData);

  this.factureService.envoyerFacture(factureData).subscribe(
    response => {
      console.log("Facture envoyée avec succès:", response);
      alert("Facture enregistrée avec succès !");
      this.closeForm();
      this.chargerFactures();
    },
    error => {
      console.error("Erreur lors de l'envoi de la facture:", error);
      alert("Une erreur est survenue lors de l'envoi de la facture.");
    }
  );
}


/**
 * ✅ Méthode pour récupérer les factures enregistrées depuis le backend
 */
chargerFactures(): void {
  this.factureService.getFactures().subscribe(
    (data) => {
      this.factures = data;
      console.log("Factures chargées avec succès :", this.factures);
    },
    (error) => {
      console.error("Erreur lors du chargement des factures :", error);
    }
  );
}


/**
 * ✅ Supprime une facture
 */
supprimerFacture(id: number): void {
  if (confirm("Voulez-vous vraiment supprimer cette facture ?")) {
    this.factureService.supprimerFacture(id).subscribe(
      () => {
        alert("Facture supprimée avec succès !");
        this.chargerFactures(); // Recharge la liste après suppression
      },
      (error) => {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression de la facture.");
      }
    );
  }
}

/**
 * ✅ Modifie une facture (prépare l'édition)
 */

modifierFacture(facture: any): void {
  this.isEditMode = true;
  this.factureSelectionnee = { ...facture }; 

  this.factureReference = facture.reference;
  this.clientName = facture.clientName;
  this.clientICE = facture.clientICE;
  this.clientCode = facture.clientCode;
  this.adresse = facture.adresse;
  this.entreprise = facture.entreprise;
  this.dateFacture = facture.dateFacture;
  this.dateEcheance = facture.dateEcheance;
  this.modePaiement = facture.modePaiement;
  this.statusPaiement = facture.statusPaiement;

if (facture.items && Array.isArray(facture.items)) {
  this.produitsSelectionnes = facture.items.map((produit: any) => ({
    produit: { 
      id: produit.id || null, 
      name: produit.name || 'Produit inconnu', 
      salesPrice: produit.salesPrice || 0, 
      tva: produit.tva || 0,
      quantity: produit.quantity || 1 
    },
    quantite: produit.quantity || 1
  }));
} else {
  console.warn("⚠️ Aucun produit trouvé dans la facture sélectionnée !");
  this.produitsSelectionnes = []; 
}


  console.log("📌 Produits chargés pour modification :", this.produitsSelectionnes);

  this.formPopup = true; 
}



updateFacture(): void {
  if (!this.factureSelectionnee) {
    console.error("Aucune facture sélectionnée pour la mise à jour.");
    return;
  }

  const updatedFactureData = {
    id: this.factureSelectionnee.id, // ID de la facture
    reference: this.factureReference,
    clientName: this.clientName,
    clientICE: this.clientICE,
    clientCode: this.clientCode,
    adresse: this.adresse,
    entreprise: this.entreprise,
    dateFacture: this.dateFacture ? new Date(this.dateFacture).toISOString().split('T')[0] : null,
    dateEcheance: this.dateEcheance ? new Date(this.dateEcheance).toISOString().split('T')[0] : null,
    modePaiement: this.modePaiement,
    statusPaiement: this.statusPaiement,
    factureItems: this.produitsSelectionnes.length > 0 ? this.produitsSelectionnes.map(item => ({
      item: { id: item.produit.id }, 
      quantite: item.quantite,
      totalHT: item.quantite * item.produit.salesPrice,
      totalTTC: item.quantite * item.produit.salesPrice * (1 + parseFloat(item.produit.tva) / 100)
    })) : [],
    totalHT: this.produitsSelectionnes.reduce((total, item) => total + item.quantite * item.produit.salesPrice, 0),
    totalTVA: this.produitsSelectionnes.reduce((total, item) => total + (item.quantite * item.produit.salesPrice * (parseFloat(item.produit.tva) / 100)), 0),
    totalTTC: this.produitsSelectionnes.reduce((total, item) => total + item.quantite * item.produit.salesPrice * (1 + parseFloat(item.produit.tva) / 100), 0)
  };

  console.log("Données mises à jour :", updatedFactureData);

  this.factureService.updateFacture(updatedFactureData).subscribe(
    response => {
      console.log("Facture mise à jour avec succès:", response);
      alert("Facture mise à jour avec succès !");
      this.closeForm();
      this.chargerFactures(); // Recharge la liste des factures après modification
    },
    error => {
      console.error("Erreur lors de la mise à jour de la facture:", error);
      alert("Une erreur est survenue lors de la mise à jour de la facture.");
    }
  );
}


updateTTC(item: any): void {
  const ht = Number(item.produit.buyPrice) || 0;
  const tva = Number(item.produit.tva) || 0;
  item.produit.ttc = ht + (ht * tva / 100);
}

















}
