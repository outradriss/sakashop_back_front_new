package com.example.sakashop.Entities;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idOrder;

  private String nameProduct;
  private int quantity;
  private int quantityAddedUrgent;
  private double salesPrice;
  private boolean isPromo;
  private double pricePromo;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;

  public Order() {}

  public Order(Long idOrder, String nameProduct, int quantity, int quantityAddedUrgent, boolean isPromo, double pricePromo, double salesPrice,LocalDateTime dateOrder, LocalDateTime lastUpdated) {
    this.idOrder = idOrder;
    this.nameProduct = nameProduct;
    this.quantity = quantity;
    this.quantityAddedUrgent = quantityAddedUrgent;
    this.isPromo = isPromo;
    this.salesPrice=salesPrice;
    this.pricePromo = pricePromo;
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

  public boolean isPromo() {
    return isPromo;
  }

  public void setIsPromo(boolean isPromo) {
    this.isPromo = isPromo;
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
