import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product-service/product.service';
import { Product } from '../models/product.model';
import { FactureService } from '../service/facture.service';
import { BonLivraisonServiceService } from '../bon-livraison-service.service';
import { Router } from '@angular/router';

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
  searchQuery: string = '';
filteredBonsLivraison: any[] = [];
clientSearch: string = '';
filteredClients: any[] = [];
  dateLivraison: Date = new Date();

  clients: any[] = [];
  selectedClientId: string = '';
  clientCode: string = '';
  selectedClient: any = null;

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
    private bonLivraisonService: BonLivraisonServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadClientsFromFactures();
    this.loadAllBL();
  }

  openForm(): void {
    this.formPopup = true;
    this.isEditMode = false;
    this.blReference = 'BL-' + Date.now();
    this.selectedClientId = '';
    this.clientCode = '';
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
        console.log(this.clients)
      },
      (error) => {
        console.error('Erreur lors du chargement des clients', error);
      }
    );
  }

  onClientSelected(): void {
    const selectedClient = this.selectedClient;
  
    if (selectedClient) {
      this.clientName = selectedClient.clientName;
      this.clientICE = selectedClient.clientICE;
      this.clientCode = selectedClient.clientCode;
      this.adresse = selectedClient.adresse;
  
      this.produitsSelectionnes = selectedClient.produits.map((produit: any) => ({
        produit: {
          id: produit.id,
          name: produit.name,
          buyPrice: produit.prixHT,
          tva: produit.tva,
          quantity: produit.quantity
        },
        quantite: produit.quantity
      }));
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
    this.produitsSelectionnes = Array.isArray(bl.itemQuantities) ? bl.itemQuantities.map((item: any) => ({
      produit: {
        id: item.productId,
        name: item.productName,
        buyPrice: item.prixHT,
        tva: item.tva,
        quantity: item.quantity
      },
      quantite: item.quantity
    })) : [];
  
    this.blEnCoursEditionId = bl.id;
  }
  


  supprimerBL(id: number): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce bon de livraison ?');
    if (confirmation) {
      this.bonLivraisonService.deleteBL(id).subscribe({
        next: () => {
          alert("Bon de Livraison supprimé avec succès !");
          this.loadAllBL(); // recharge la liste après suppression
        },
        error: err => {
          console.error('Erreur lors de la suppression du Bon de Livraison :', err);
          alert("Une erreur est survenue lors de la suppression du Bon de Livraison.");
        }
      });
    }
  }
  
  imprimerBL(bl: any): void {
    this.blReference = bl.reference;
    this.clientName = bl.clientName;
    this.clientICE = bl.clientICE;
    this.adresse = bl.adresse;
    this.dateLivraison = new Date(bl.dateLivraison);
  
    this.produitsSelectionnes = Array.isArray(bl.itemQuantities)
      ? bl.itemQuantities.map((item: any) => ({
          produit: {
            id: item.productId,
            name: item.productName,
            buyPrice: item.prixHT,
            tva: item.tva,
            quantity: item.quantity,
          },
          quantite: item.quantity
        }))
      : [];
  
    this.generateBLAndPrint(false);
  }
  


  generateBLAndPrint(enregistrer: boolean = true): void {
    if (enregistrer) {
      this.envoyerBL();
    }
  
    const dateLivraisonFormatted = new Date(this.dateLivraison).toLocaleDateString();
  
    const totalRows = 30;
    const filledRows = this.produitsSelectionnes.length;
    const emptyRows = Math.max(0, totalRows - filledRows);
  
    const blHTML = `
      <html>
        <head>
          <title>Bon de Livraison</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; width: 210mm; height: 297mm; }
            .bl-container { width: 190mm; height: 277mm; margin: auto; padding: 15mm; background: #fff; display: flex; flex-direction: column; box-sizing: border-box; }
            .bl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            .bl-header img { max-height: 100px; }
            .bl-header div { text-align: right; }
            .bl-info { display: flex; justify-content: space-between; gap: 10mm; margin-bottom: 10px; }
            .bl-info div { padding: 5px; border: 1px solid #000; width: 48%; background: #f9f9f9; font-size: 10px; }
            .bl-info strong { display: block; font-size: 11px; }
            .bl-table-container { flex-grow: 1; padding: 5px; }
  
            .bl-table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000; }
            .bl-table th, .bl-table td { padding: 5px; text-align: center; font-size: 10px; border: 1px solid #000; }
            .bl-table th { background: #000; color: #fff; text-transform: uppercase; }
  
            @media print {
              .bl-container { width: 210mm; height: 297mm; }
              .bl-table th { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class='bl-container'>
            <div class='bl-header'>
              <img src='/logos/BAGGAGIO.png' alt='BAGGAGIO'>
              <div>
                <h2>Bon de Livraison - ${this.blReference}</h2>
                <p>Date de livraison : ${dateLivraisonFormatted}</p>
                <p>Client : ${this.clientName}</p>
              </div>
            </div>
  
            <div class='bl-info'>
              <div>
                <strong>Émetteur</strong>
                <p>BAGGAGIO</p>
                <p>18, Rue ibn habib RDC Résidence ANAOURASS Casablanca</p>
                <p>Tél.: 05222-66800 | +2126-79899480</p>
                <p>Email: contact@monbagage.ma</p>
              </div>
              <div>
                <strong>Destinataire</strong>
                <p>${this.clientName}</p>
                <p>ICE: ${this.clientICE}</p>
                <p>Adresse: ${this.adresse}</p>
              </div>
            </div>
  
            <div class='bl-table-container'>
              <table class='bl-table'>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    this.produitsSelectionnes.map((item) => `
                      <tr>
                        <td>${item.produit.name}</td>
                        <td>${item.quantite}</td>
                      </tr>
                    `).join('')
                  }
             
                </tbody>
              </table>
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
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
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
          productId: item.produit.id,
          productName: item.produit.name,
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
  
    const apiCall = this.isEditMode && this.blEnCoursEditionId
      ? this.bonLivraisonService.updateBL(this.blEnCoursEditionId, blData)
      : this.bonLivraisonService.envoyerBL(blData);
  
    apiCall.subscribe(
      response => {
        console.log("Bon de Livraison sauvegardé avec succès :", response);
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
    this.bonLivraisonService.getAllBL().subscribe((data) => {
      this.bonsLivraison = data;
      this.filteredBonsLivraison = data; 
    });
  }
  filterBL(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredBonsLivraison = this.bonsLivraison.filter(bl =>
      bl.reference.toLowerCase().includes(query) ||
      bl.clientName.toLowerCase().includes(query)
    );
  }
  checkStock(item: any): void {
    if (item.quantite > item.produit.quantity) {
      item.quantite = item.produit.quantity;
    }
  }


  filtrerClients(): void {
    const query = this.clientSearch.trim().toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.clientName.toLowerCase().includes(query) ||
      client.clientICE.toLowerCase().includes(query)
    );
  }
  
  choisirClient(client: any): void {
    this.selectedClient = client;
    this.clientSearch = `${client.clientName} - ${client.clientICE}`;
    this.filteredClients = [];
  
    // Remplir les champs
    this.clientName = client.clientName;
    this.clientICE = client.clientICE;
    this.clientCode = client.clientCode;
    this.adresse = client.adresse;
  
    this.produitsSelectionnes = client.produits.map((produit: any) => ({
      produit: {
        id: produit.id,
        name: produit.name,
        buyPrice: produit.prixHT,
        tva: produit.tva,
        quantity: produit.quantity
      },
      quantite: produit.quantity
    }));
  }

  
  logout() {
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }

}
