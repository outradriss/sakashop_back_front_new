import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product-service/product.service';
import { Product } from '../models/product.model';
import { FactureService } from '../service/facture.service';
import { BonLivraisonServiceService } from '../bon-livraison-service.service';

@Component({
  selector: 'app-bon-livraison',
  templateUrl: './bon-livraison.component.html',
  standalone:false,
  styleUrls: ['./bon-livraison.component.css']
})
export class BonLivraisonComponent implements OnInit {
  blReference: string = 'BL-' + Date.now();
  clientName: string = '';
  clientICE: string = '';
  adresse: string = '';
  nouveauClientNom: string = '';

  dateLivraison: Date = new Date();

  clients: any[] = [];
  selectedClientId: string = '';

  produitsSelectionnes: any[] = [];

  products: Product[] = [];
  discountSearchQuery: string = '';
  discountFilteredProducts: Product[] = [];

  bonsLivraison: any[] = [];
  formPopup: boolean = false;
  isEditMode: boolean = false;
  blEnCoursEditionId: number | null = null;

  constructor(
    private productService: ProductService,
    private factureService: FactureService,
    private bonLivraisonService: BonLivraisonServiceService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadClientsFromFactures();
  }

  openForm(): void {
    this.formPopup = true;
    this.isEditMode = false;
    this.blReference = 'BL-' + Date.now();
    this.selectedClientId = '';
    this.clientName = '';
    this.clientICE = '';
    this.adresse = '';
    this.dateLivraison = new Date();
    this.produitsSelectionnes = [];
    this.blEnCoursEditionId = null;
  }

  closeForm(): void {
    this.formPopup = false;
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }

  loadClientsFromFactures(): void {
    this.factureService.getClientsFromFactures().subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des clients', error);
      }
    );
  }

  onClientSelected(): void {
    const client = this.clients.find(c => c.id == this.selectedClientId);
    if (client) {
      this.clientName = client.name;
      this.clientICE = client.ice;
      this.adresse = client.adresse;
    } else {
      // Réinitialise si aucun client sélectionné
      this.clientName = '';
      this.clientICE = '';
      this.adresse = '';
    }
  }
  

  filterDiscountProducts(): void {
    const query = this.discountSearchQuery.trim().toLowerCase();
    this.discountFilteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.itemCode?.toLowerCase().includes(query)) ||
      (product.code?.toLowerCase().includes(query))
    );
  }

  selectProduct(product: Product): void {
    const exist = this.produitsSelectionnes.find(p => p.produit.id === product.id);
    if (!exist) {
      this.produitsSelectionnes.push({ produit: product, quantite: 1 });
    }
    this.discountSearchQuery = '';
    this.discountFilteredProducts = [];
  }

  removeProduct(index: number): void {
    this.produitsSelectionnes.splice(index, 1);
  }

  modifierBL(bl: any): void {
    this.isEditMode = true;
    this.formPopup = true;
    this.blReference = bl.reference;
    this.clientName = bl.clientName;
    this.clientICE = bl.clientICE;
    this.adresse = bl.adresse;
    this.dateLivraison = new Date(bl.dateLivraison);
    this.produitsSelectionnes = [...bl.produits];
    this.blEnCoursEditionId = bl.id;
  }

  supprimerBL(id: number): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce bon de livraison ?');
    if (confirmation) {
      this.bonsLivraison = this.bonsLivraison.filter(bl => bl.id !== id);
    }
  }

  imprimerBL(bl: any): void {
    this.blReference = bl.reference;
    this.clientName = bl.clientName;
    this.clientICE = bl.clientICE;
    this.adresse = bl.adresse;
    this.dateLivraison = new Date(bl.dateLivraison);
    this.produitsSelectionnes = [...bl.produits];
    this.generateBLAndPrint();
  }

  generateBLAndPrint(): void {
    const dateLivraisonFormatted = new Date(this.dateLivraison).toLocaleDateString();
  
    // Calcul HT, TVA, TTC comme pour la facture
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
  
    const blHTML = `
      <html>
        <head>
          <title>Bon de Livraison</title>
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
                <h2>Bon de Livraison - ${this.blReference}</h2>
                <p>Date de livraison : ${dateLivraisonFormatted}</p>
                <p>Code client : ${this.clientName}</p>
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
                <p>Adresse: ${this.adresse}</p>
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
                    ${Array(emptyRows).fill(`<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('')}
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
      printWindow.document.write(blHTML);
      printWindow.document.close();
      printWindow.print();
    }
  
    this.closeForm();
  }
  updateTTC(item: any): void {
    const prixHT = Number(item.produit.buyPrice) || 0;
    const tva = Number(item.produit.tva) || 0;
    const prixTTC = prixHT + (prixHT * tva / 100);
    item.produit.prixTTC = prixTTC;
  }
  
  
  envoyerBL(): void {
    if (this.produitsSelectionnes.length === 0) {
      alert("Ajoutez au moins un produit avant d'envoyer le bon de livraison !");
      return;
    }
  
    if (!this.clientName || !this.clientICE || !this.adresse) {
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
  
    const blData = {
      reference: this.blReference,
      clientName: this.clientName,
      clientICE: this.clientICE,
      adresse: this.adresse,
      dateLivraison: this.dateLivraison ? new Date(this.dateLivraison).toISOString().split('T')[0] : null,
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
  
    console.log("Données Bon de Livraison :", blData);
  
    this.bonLivraisonService.envoyerBL(blData).subscribe(
      response => {
        console.log("Bon de Livraison enregistré avec succès:", response);
        alert("Bon de Livraison enregistré avec succès !");
        this.closeForm();
        this.loadAllBL();
      },
      error => {
        console.error("Erreur lors de l'envoi du Bon de Livraison:", error);
        alert("Une erreur est survenue lors de l'envoi du Bon de Livraison.");
      }
    );
  }
  loadAllBL(): void {
    this.bonLivraisonService.getAllBL().subscribe(
      (data) => {
        this.bonsLivraison = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des bons de livraison :", error);
        alert("Une erreur est survenue lors du chargement des bons de livraison.");
      }
    );
  }
  

}
