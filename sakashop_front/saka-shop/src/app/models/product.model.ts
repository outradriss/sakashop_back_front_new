export interface Categories {
    id: number;
    name: string;
    createdDate: string;
  }

export class Product {
    id: number;
    itemCode: string;    // Code unique du produit
    name: string;        // Nom du produit
    quantity: number;    // Quantité disponible
    buyPrice: number;    // Prix d'achat
    salesPrice: number;  // Prix de vente
    categories: Categories;    // Catégorie du produit
    supplier: string;    // Fournisseur du produit
    isPromo: boolean;
    pricePromo:number;
    productAddedDate:Date;
    expiredDate : Date;
    quantityInCart?: number;
    negoPrice:number;
  
    constructor(
      id: number= 0,
      itemCode: string = '',
      name: string = '',
      quantity: number = 0,
      buyPrice: number = 0,
      salesPrice: number = 0,
      categories: Categories = { id: 0, name: '', createdDate: '' },
      supplier: string = '',
      pricePromo:number=0,
      isPromo:boolean=false,
      productAddedDate:Date=new Date(),
      expiredDate : Date = new Date(),
      quantityInCart:number=0,
      negoPrice:number=0
    ) {
      this.id=id;
      this.itemCode = itemCode;
      this.name = name;
      this.quantity = quantity;
      this.categories = categories;
      this.buyPrice = buyPrice;
      this.salesPrice = salesPrice;
      this.supplier = supplier;
      this.pricePromo=pricePromo;
      this.isPromo=isPromo;
      this.productAddedDate=productAddedDate;
      this.expiredDate=expiredDate;
      this.quantityInCart=quantityInCart;
      this.negoPrice=negoPrice;
    }
  
    /**
     * Calculer la marge bénéficiaire pour le produit.
     * @returns La marge bénéficiaire
     */
  
  }
  