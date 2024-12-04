package com.example.sakashop.DTO;

import java.time.LocalDateTime;


public class OrderRequestDTO {
  private Long idOrder;
  private String nameProduct;
  private int quantity;
  private int quantityAddedUrgent;
  private boolean isPromo;
  private double pricePromo;
  private double salesPrice;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;
  private Long itemId;
  private Long itemsOrders;
  private double totalePrice;
  private double negoPrice;

  // Constructeur privé pour forcer l'utilisation du Builder
  private OrderRequestDTO(Builder builder) {
    this.idOrder = builder.idOrder;
    this.nameProduct = builder.nameProduct;
    this.quantity = builder.quantity;
    this.quantityAddedUrgent = builder.quantityAddedUrgent;
    this.isPromo = builder.isPromo;
    this.pricePromo = builder.pricePromo;
    this.salesPrice = builder.salesPrice;
    this.dateOrder = builder.dateOrder;
    this.lastUpdated = builder.lastUpdated;
    this.itemId = builder.itemId;
    this.itemsOrders = builder.itemsOrders;
    this.totalePrice = builder.totalePrice;
    this.negoPrice = builder.negoPrice;
  }

  // Getter uniquement (pas de setter pour rendre la classe immuable)
  public Long getIdOrder() { return idOrder; }
  public String getNameProduct() { return nameProduct; }
  public int getQuantity() { return quantity; }
  public int getQuantityAddedUrgent() { return quantityAddedUrgent; }
  public boolean getIsPromo() { return isPromo; }
  public double getPricePromo() { return pricePromo; }
  public double getSalesPrice() { return salesPrice; }
  public LocalDateTime getDateOrder() { return dateOrder; }
  public LocalDateTime getLastUpdated() { return lastUpdated; }
  public Long getItemId() { return itemId; }
  public Long getItemsOrders() { return itemsOrders; }
  public double getTotalePrice() { return totalePrice; }
  public double getNegoPrice() { return negoPrice; }

  // Classe Builder interne
  public static class Builder {
    private Long idOrder;
    private String nameProduct;
    private int quantity;
    private int quantityAddedUrgent;
    private boolean isPromo;
    private double pricePromo;
    private double salesPrice;
    private LocalDateTime dateOrder;
    private LocalDateTime lastUpdated;
    private Long itemId;
    private Long itemsOrders;
    private double totalePrice;
    private double negoPrice;

    public Builder setIdOrder(Long idOrder) {
      this.idOrder = idOrder;
      return this;
    }

    public Builder setNameProduct(String nameProduct) {
      this.nameProduct = nameProduct;
      return this;
    }

    public Builder setQuantity(int quantity) {
      this.quantity = quantity;
      return this;
    }

    public Builder setQuantityAddedUrgent(int quantityAddedUrgent) {
      this.quantityAddedUrgent = quantityAddedUrgent;
      return this;
    }

    public Builder setIsPromo(boolean isPromo) {
      this.isPromo = isPromo;
      return this;
    }

    public Builder setPricePromo(double pricePromo) {
      this.pricePromo = pricePromo;
      return this;
    }

    public Builder setSalesPrice(double salesPrice) {
      this.salesPrice = salesPrice;
      return this;
    }

    public Builder setDateOrder(LocalDateTime dateOrder) {
      this.dateOrder = dateOrder;
      return this;
    }

    public Builder setLastUpdated(LocalDateTime lastUpdated) {
      this.lastUpdated = lastUpdated;
      return this;
    }

    public Builder setItemId(Long itemId) {
      this.itemId = itemId;
      return this;
    }

    public Builder setItemsOrders(Long itemsOrders) {
      this.itemsOrders = itemsOrders;
      return this;
    }

    public Builder setTotalePrice(double totalePrice) {
      this.totalePrice = totalePrice;
      return this;
    }

    public Builder setNegoPrice(double negoPrice) {
      this.negoPrice = negoPrice;
      return this;
    }

    // Méthode pour construire l'objet DTO
    public OrderRequestDTO build() {
      return new OrderRequestDTO(this);
    }
  }
}

