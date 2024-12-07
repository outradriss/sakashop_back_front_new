package com.example.sakashop.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import java.time.LocalDateTime;

@JsonDeserialize(builder = OrderRequestDTO.Builder.class)

public class OrderRequestDTO {
  private final Long idOrder;
  private final String nameProduct;
  private final int quantity;
  private final int quantityAddedUrgent;
  private final boolean isPromo;
  private final double pricePromo;
  private final double salesPrice;
  private final LocalDateTime dateOrder;
  private final LocalDateTime lastUpdated;
  private final Long itemId;
  private final Long itemsOrders;
  private final double totalePrice;
  private final double negoPrice;
  private final double buyPrice;

  // Constructeur privé pour le Pattern Builder
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
    this.buyPrice=builder.buyPrice;
  }

  // Getter uniquement (immuabilité)
  public Long getIdOrder() {
    return idOrder;
  }

  public String getNameProduct() {
    return nameProduct;
  }

  public int getQuantity() {
    return quantity;
  }

  public int getQuantityAddedUrgent() {
    return quantityAddedUrgent;
  }

  public boolean getIsPromo() {
    return isPromo;
  }

  public double getPricePromo() {
    return pricePromo;
  }

  public double getSalesPrice() {
    return salesPrice;
  }

  public LocalDateTime getDateOrder() {
    return dateOrder;
  }

  public LocalDateTime getLastUpdated() {
    return lastUpdated;
  }

  public Long getItemId() {
    return itemId;
  }

  public Long getItemsOrders() {
    return itemsOrders;
  }

  public double getTotalePrice() {
    return totalePrice;
  }

  public double getNegoPrice() {
    return negoPrice;
  }
  public double getBuyPrice() {
    return buyPrice;
  }

  // Classe Builder interne avec annotations pour Jackson
  @JsonPOJOBuilder(buildMethodName = "buildOrder", withPrefix = "set")
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
    private  double buyPrice;

    @JsonCreator // Indique à Jackson d'utiliser ce constructeur pour désérialiser
    public Builder(
      @JsonProperty("idOrder") Long idOrder,
      @JsonProperty("nameProduct") String nameProduct,
      @JsonProperty("quantity") int quantity,
      @JsonProperty("quantityAddedUrgent") int quantityAddedUrgent,
      @JsonProperty("isPromo") boolean isPromo,
      @JsonProperty("pricePromo") double pricePromo,
      @JsonProperty("salesPrice") double salesPrice,
      @JsonProperty("dateOrder") LocalDateTime dateOrder,
      @JsonProperty("lastUpdated") LocalDateTime lastUpdated,
      @JsonProperty("itemId") Long itemId,
      @JsonProperty("itemsOrders") Long itemsOrders,
      @JsonProperty("totalePrice") double totalePrice,
      @JsonProperty("negoPrice") double negoPrice,
      @JsonProperty("buyPrice") double buyPrice
    ) {
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
      this.buyPrice=buyPrice;
    }

    public Builder setIdOrder(Long idOrder) {
      this.idOrder = idOrder;
      return this;
    }

    public Builder setNameProduct(String nameProduct) {
      this.nameProduct = nameProduct;
      return this;
    }
    public Builder setBuyPrice(double buyPrice) {
      this.buyPrice = buyPrice;
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

    public OrderRequestDTO buildOrder() {
      return new OrderRequestDTO(this);
    }
  }
}
