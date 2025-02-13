import { Component } from '@angular/core';
import { ProductService } from '../service/product-service/product.service';
import { Product } from '../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


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
  constructor(private productService: ProductService , private cdRef: ChangeDetectorRef)  { }

  ngOnInit() {
    this.loadProducts();
    console.log('Produits chargés:', this.products);

  }
  openForm(): void {
    this.factureReference = this.generateFactureReference();
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
    return this.produitsSelectionnes.reduce(
      (total, item) => total + item.quantite * item.produit.salesPrice,
      0
    );
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


generateInvoiceAndPrint() {
  console.log("Generation de la facture...");
  const doc = new jsPDF();

  // Ajout du logo
  const logoPath = "/logos/BAGGAGIO.png";
  const img = new Image();
  img.src = logoPath;

  img.onload = () => {
    doc.addImage(img, "PNG", 20, 10, 50, 20); // Position (x, y) et taille (largeur, hauteur)

    // En-tête de la facture
    doc.setFontSize(12);
    doc.text("Proposition PR2410-XXXX", 140, 20);
    doc.text(`Date de proposition : ${new Date().toLocaleDateString()}`, 140, 25);
    doc.text(`Date de fin de validité : `, 140, 30);
    doc.text(`Code client : `, 140, 35);

    // Infos de l'entreprise avec bordure et fond gris
    doc.setFillColor(240, 240, 240); // Couleur de fond gris clair
    doc.rect(15, 45, 85, 35, 'F'); // Rectangle de fond (x, y, largeur, hauteur, 'F' pour remplir)
    doc.setDrawColor(0); // Couleur de la bordure (noir)
    doc.setLineWidth(0.1); // Épaisseur de la bordure (fine)
    doc.rect(15, 45, 85, 35); // Rectangle de bordure

    doc.setFontSize(10);
    doc.text("Émetteur", 20, 50);
    doc.text("Nom de l'entreprise", 20, 55);
    doc.text("Adresse de l'entreprise", 20, 60);
    doc.text("Téléphone : ", 20, 65);
    doc.text("Email : ", 20, 70);
    doc.text("ICE : ", 20, 75);

    // Infos du client avec bordure et fond gris
    doc.setFillColor(240, 240, 240); // Couleur de fond gris clair
    doc.rect(135, 45, 65, 35, 'F'); // Rectangle de fond
    doc.setDrawColor(0); // Couleur de la bordure (noir)
    doc.setLineWidth(0.1); // Épaisseur de la bordure (fine)
    doc.rect(135, 45, 65, 35); // Rectangle de bordure

    doc.text("Adresse à", 140, 50);
    doc.text(`Nom : ${this.clientName}`, 140, 55);
    doc.text(`ICE : ${this.clientICE}`, 140, 60);

    // Tableau des produits avec bordure fine
    const startY = 90; // Position Y de départ du tableau
    const tableWidth = 190; // Largeur du tableau
    const tableHeight = doc.internal.pageSize.height - startY - 20; // Hauteur du tableau (jusqu'en bas de la page)

    // Dessiner la bordure fine autour du tableau
    doc.setDrawColor(0); // Couleur de la bordure (noir)
    doc.setLineWidth(0.1); // Épaisseur de la bordure (fine)
    doc.rect(10, startY, tableWidth, tableHeight); // Rectangle de bordure (x, y, largeur, hauteur)

    autoTable(doc, {
      startY: startY,
      head: [["Désignation", "P.U. HT", "TVA", "Qté", "Total HT"]],
      body: this.produitsSelectionnes.map((item) => [
        item.produit.name,
        item.produit.salesPrice.toFixed(2),
        item.produit.tva + "%",
        item.quantite,
        (item.quantite * item.produit.salesPrice).toFixed(2),
      ]),
    });

    // Calcul des totaux
    const totalHT = this.produitsSelectionnes.reduce((sum, item) => sum + item.quantite * item.produit.salesPrice, 0);
    const totalTVA = totalHT * 0.2;
    const totalTTC = totalHT + totalTVA;

    // Totaux avec bordure et fond gris
    const finalY = doc.internal.pageSize.height - 20; // Position Y en bas de la page

    doc.setFillColor(240, 240, 240); // Couleur de fond gris clair
    doc.rect(135, finalY - 25, 65, 25, 'F'); // Rectangle de fond
    doc.setDrawColor(0); // Couleur de la bordure (noir)
    doc.setLineWidth(0.1); // Épaisseur de la bordure (fine)
    doc.rect(135, finalY - 25, 65, 25); // Rectangle de bordure

    doc.text(`Total HT : ${totalHT.toFixed(2)} MAD`, 140, finalY - 20);
    doc.text(`Total TVA 20% : ${totalTVA.toFixed(2)} MAD`, 140, finalY - 15);
    doc.text(`Total TTC : ${totalTTC.toFixed(2)} MAD`, 140, finalY - 10);

    // Impression
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  img.onerror = () => {
    console.error("Erreur de chargement de l'image. Vérifiez le chemin :", logoPath);
  };
}


}
