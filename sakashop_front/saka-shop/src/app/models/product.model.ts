export class Product {
    itemCode: string;    // Code unique du produit
    name: string;        // Nom du produit
    quantity: number;    // Quantité disponible
    buyPrice: number;    // Prix d'achat
    salesPrice: number;  // Prix de vente
    category: string;    // Catégorie du produit
    supplier: string;    // Fournisseur du produit
  
    constructor(
      itemCode: string = '',
      name: string = '',
      quantity: number = 0,
      buyPrice: number = 0,
      salesPrice: number = 0,
      category: string = '',
      supplier: string = ''
    ) {
      this.itemCode = itemCode;
      this.name = name;
      this.quantity = quantity;
      this.buyPrice = buyPrice;
      this.salesPrice = salesPrice;
      this.category = category;
      this.supplier = supplier;
    }
  
    /**
     * Calculer la marge bénéficiaire pour le produit.
     * @returns La marge bénéficiaire
     */
  
  }
  