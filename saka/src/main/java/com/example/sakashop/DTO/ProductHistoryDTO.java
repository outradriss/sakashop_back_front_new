package com.example.sakashop.DTO;

import java.time.LocalDateTime;
import java.util.Date;

public class ProductHistoryDTO {
  private String nameProduct;
  private Long productId;
  private Date productAddedDate;
  private int stockQuantity;
  private int cartQuantity;
  private LocalDateTime dateIntegration;
  private Long orderId;
  private double totalPrice;
  private LocalDateTime orderDate;
  private double salesPrice;
  private double negoPrice;
  private LocalDateTime dateUpdate;

  public ProductHistoryDTO(String nameProduct, Long productId, Date productAddedDate, int stockQuantity,
                           int cartQuantity, LocalDateTime dateIntegration, Long orderId, double totalPrice,
                           LocalDateTime orderDate, double salesPrice, double negoPrice, LocalDateTime dateUpdate) {
    this.nameProduct = nameProduct;
    this.productId = productId;
    this.productAddedDate = productAddedDate;
    this.stockQuantity = stockQuantity;
    this.cartQuantity = cartQuantity;
    this.dateIntegration = dateIntegration;
    this.orderId = orderId;
    this.totalPrice = totalPrice;
    this.orderDate = orderDate;
    this.salesPrice = salesPrice;
    this.negoPrice = negoPrice;
    this.dateUpdate = dateUpdate;
  }

  public String getNameProduct() {
    return nameProduct;
  }

  public void setNameProduct(String nameProduct) {
    this.nameProduct = nameProduct;
  }

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public Date getProductAddedDate() {
    return productAddedDate;
  }

  public void setProductAddedDate(Date productAddedDate) {
    this.productAddedDate = productAddedDate;
  }

  public int getStockQuantity() {
    return stockQuantity;
  }

  public void setStockQuantity(int stockQuantity) {
    this.stockQuantity = stockQuantity;
  }

  public int getCartQuantity() {
    return cartQuantity;
  }

  public void setCartQuantity(int cartQuantity) {
    this.cartQuantity = cartQuantity;
  }

  public LocalDateTime getDateIntegration() {
    return dateIntegration;
  }

  public void setDateIntegration(LocalDateTime dateIntegration) {
    this.dateIntegration = dateIntegration;
  }

  public Long getOrderId() {
    return orderId;
  }

  public void setOrderId(Long orderId) {
    this.orderId = orderId;
  }

  public double getTotalPrice() {
    return totalPrice;
  }

  public void setTotalPrice(double totalPrice) {
    this.totalPrice = totalPrice;
  }

  public LocalDateTime getOrderDate() {
    return orderDate;
  }

  public void setOrderDate(LocalDateTime orderDate) {
    this.orderDate = orderDate;
  }

  public double getSalesPrice() {
    return salesPrice;
  }

  public void setSalesPrice(double salesPrice) {
    this.salesPrice = salesPrice;
  }

  public double getNegoPrice() {
    return negoPrice;
  }

  public void setNegoPrice(double negoPrice) {
    this.negoPrice = negoPrice;
  }

  public LocalDateTime getDateUpdate() {
    return dateUpdate;
  }

  public void setDateUpdate(LocalDateTime dateUpdate) {
    this.dateUpdate = dateUpdate;
  }
}