import { Product } from "./product.model";

export interface Credit {
    id: number;              
    nameClient: string;      
    quantity: number;        
    totale: number;          
    localDateTime: string;   
    datePayCredit: string;   
    comment: string;   
    productName: string;   
    product: Product;        
  }