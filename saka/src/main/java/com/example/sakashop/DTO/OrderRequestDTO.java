package com.example.sakashop.DTO;

import java.time.LocalDateTime;

public class OrderRequestDTO {
  private Long idOrder;
  private String nameProduct;
  private int quantity;
  private int quantityAddedUrgent;
  private boolean isPromo;
  private double pricePromo;
  private  double salesPrice;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;
  private Long itemId;
  private Long itemsOrders;
  private double totalePrice;
  private double negoPrice;

  public OrderRequestDTO() {
  }

  public OrderRequestDTO(Long idOrder, String nameProduct, int quantity, int quantityAddedUrgent, boolean isPromo, double pricePromo, double salesPrice, LocalDateTime dateOrder, LocalDateTime lastUpdated, Long itemId, Long itemsOrders, double totalePrice, double negoPrice) {
    this.idOrder = idOrder;
    this.nameProduct = nameProduct;
    this.quantity = quantity;
    this.quantityAddedUrgent = quantityAddedUrgent;
    this.isPromo = isPromo;
    this.pricePromo = pricePromo;
    this.salesPrice = salesPrice;
    this.dateOrder = dateOrder;
    this.lastUpdated = lastUpdated;
    this.itemId = itemId;
    this.itemsOrders = itemsOrders;
    this.totalePrice = totalePrice;
    this.negoPrice = negoPrice;
  }

  public double getTotalePrice() {
    return totalePrice;
  }

  public void setTotalePrice(double totalePrice) {
    this.totalePrice = totalePrice;
  }

  public double getNegoPrice() {
    return negoPrice;
  }

  public void setNegoPrice(double negoPrice) {
    this.negoPrice = negoPrice;
  }

  public Long getItemsOrders() {
    return itemsOrders;
  }

  public void setItemsOrders(Long itemsOrders) {
    this.itemsOrders = itemsOrders;
  }

  public Long getItemId() {
    return itemId;
  }

  public void setItemId(Long itemId) {
    this.itemId = itemId;
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
