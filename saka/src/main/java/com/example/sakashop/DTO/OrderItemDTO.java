package com.example.sakashop.DTO;

import java.time.LocalDateTime;

public class OrderItemDTO {
  private String idOrderChange;
  private String itemName;
  private double salesPrice;
  private LocalDateTime dateCommande;
  public LocalDateTime getDateCommande() {
    return dateCommande;
  }

  public void setDateCommande(LocalDateTime dateCommande) {
    this.dateCommande = dateCommande;
  }



  public OrderItemDTO(String idOrderChange, String itemName, double salesPrice,LocalDateTime dateCommande) {
    this.idOrderChange = idOrderChange;
    this.itemName = itemName;
    this.salesPrice = salesPrice;
    this.dateCommande=dateCommande;
  }

  // Getters
  public String getIdOrderChange() { return idOrderChange; }
  public String getItemName() { return itemName; }
  public double getSalesPrice() { return salesPrice; }
}
