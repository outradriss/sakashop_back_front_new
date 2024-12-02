package com.example.sakashop.DTO;

import com.example.sakashop.Entities.Item;

import javax.persistence.OneToOne;
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

  public OrderRequestDTO(Long idOrder, String nameProduct, int quantity, int quantityAddedUrgent, boolean isPromo, double pricePromo, double salesPrice, Long itemsOrders,LocalDateTime dateOrder, LocalDateTime lastUpdated, Long itemId) {
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
    this.itemsOrders=itemsOrders;
  }
  public OrderRequestDTO() {
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
