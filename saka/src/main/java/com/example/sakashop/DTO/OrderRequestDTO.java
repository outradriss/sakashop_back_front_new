package com.example.sakashop.DTO;

import java.time.LocalDateTime;

public class OrderRequestDTO {
  private Long idOrder; // Géré automatiquement dans la base
  private String nameProduct;
  private int quantity;
  private int quantityAddedUrgent;
  private boolean isPromo;
  private double pricePromo;
  private  double salesPrice;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;
  // Getters et Setters

  public OrderRequestDTO() {
  }

  public OrderRequestDTO(Long idOrder, String nameProduct, int quantity, int quantityAddedUrgent, boolean isPromo, double salesPrice,double pricePromo, LocalDateTime dateOrder, LocalDateTime lastUpdated) {
    this.idOrder = idOrder;
    this.nameProduct = nameProduct;
    this.quantity = quantity;
    this.quantityAddedUrgent = quantityAddedUrgent;
    this.isPromo = isPromo;
    this.pricePromo = pricePromo;
    this.salesPrice=salesPrice;
    this.dateOrder = dateOrder;
    this.lastUpdated = lastUpdated;
  }

  public double getSalesPrice() {
    return salesPrice;
  }

  public void setSalesPrice(double salesPrice) {
    this.salesPrice = salesPrice;
  }

  public Long getIdOrder() {
    return idOrder;
  }

  public void setIdOrder(Long idOrder) {
    this.idOrder = idOrder;
  }

  public String getNameProduct() {
    return nameProduct;
  }

  public void setNameProduct(String nameProduct) {
    this.nameProduct = nameProduct;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public int getQuantityAddedUrgent() {
    return quantityAddedUrgent;
  }

  public void setQuantityAddedUrgent(int quantityAddedUrgent) {
    this.quantityAddedUrgent = quantityAddedUrgent;
  }

  public boolean getIsPromo() {
    return isPromo;
  }

  public void setPromo(boolean promo) {
    isPromo = promo;
  }

  public double getPricePromo() {
    return pricePromo;
  }

  public void setPricePromo(double pricePromo) {
    this.pricePromo = pricePromo;
  }

  public LocalDateTime getDateOrder() {
    return dateOrder;
  }

  public void setDateOrder(LocalDateTime dateOrder) {
    this.dateOrder = dateOrder;
  }

  public LocalDateTime getLastUpdated() {
    return lastUpdated;
  }

  public void setLastUpdated(LocalDateTime lastUpdated) {
    this.lastUpdated = lastUpdated;
  }
}
