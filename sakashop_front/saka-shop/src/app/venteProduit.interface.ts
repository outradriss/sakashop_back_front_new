import { Product } from "./models/product.model";

export interface VenteProduit extends Product {
    productName: string;
    typePaiement: string;
  }
  