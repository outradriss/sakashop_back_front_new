export class Product {
    id: number;
    itemCode: string;    // Code unique du produit
    name: string;        // Nom du produit
    quantity: number;    // Quantité disponible
    buyPrice: number;    // Prix d'achat
    salesPrice: number;  // Prix de vente
    category: string;    // Catégorie du produit
    supplier: string;    // Fournisseur du produit
    isPromo: boolean;
    pricePromo:number;
    productAddedDate:Date;
  
    constructor(
        id: number= 0,
      itemCode: string = '',
      name: string = '',
      quantity: number = 0,
      buyPrice: number = 0,
      salesPrice: number = 0,
      category: string = '',
      supplier: string = '',
      pricePromo:number=0,
      isPromo:boolean=false,
      productAddedDate:Date=new Date()
    ) {
      this.id=id;
      this.itemCode = itemCode;
      this.name = name;
      this.quantity = quantity;
      this.buyPrice = buyPrice;
      this.salesPrice = salesPrice;
      this.category = category;
      this.supplier = supplier;
      this.pricePromo=pricePromo;
      this.isPromo=isPromo;
      this.productAddedDate=productAddedDate;
    }
  
    /**
     * Calculer la marge bénéficiaire pour le produit.
     * @returns La marge bénéficiaire
     */
  
  }
  