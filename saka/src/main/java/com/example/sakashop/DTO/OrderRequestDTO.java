package com.example.sakashop.DTO;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import java.time.LocalDateTime;
import java.util.List;

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
  private final String idOrderChange;
  private final String comment;
  private final String typePaiement;
  private final double chequeAmount;
  private final double cardAmount;
  private final double cashAmount;


  public double getChequeAmount() {
    return chequeAmount;
  }

  public double getCardAmount() {
    return cardAmount;
  }

  public double getCashAmount() {
    return cashAmount;
  }

  public String getTypePaiement() {
    return typePaiement;
  }



  public String getComment() {
    return comment;
  }




  private final List<ItemRequestDTO> items; // Nouvelle liste pour les articles

  // Getter pour `items`
  public List<ItemRequestDTO> getItems() {
    return items;
  }

  public String getIdOrderChange() {
    return idOrderChange;
  }


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

  public boolean isPromo() {
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

  // Constructeur privé pour le Builder
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
    this.buyPrice = builder.buyPrice;
    this.items = builder.items;
    this.idOrderChange = builder.idOrderChange;
    this.comment= builder.comment;
    this.typePaiement=builder.typePaiement;
    this.cashAmount=builder.cashAmount;
    this.chequeAmount=builder.chequeAmount;
    this.cardAmount=builder.cardAmount;

  }

  @JsonPOJOBuilder(buildMethodName = "buildOrder", withPrefix = "set")
  public static class Builder {
    @JsonProperty("id_order")
    private Long idOrder;
    public double cashAmount;
    public double chequeAmount;
    public double cardAmount;
    private String nameProduct;
    private int quantity;
    private int quantityAddedUrgent;
    private boolean isPromo;
    private double pricePromo;
    private double salesPrice;
    @JsonProperty("date_order")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime dateOrder;
    @JsonProperty("last_updated")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime lastUpdated;
    private Long itemId;
    private Long itemsOrders;
    @JsonProperty("totale_price")
    private double totalePrice;
    private double negoPrice;
    private double buyPrice;
    private List<ItemRequestDTO> items;
    @JsonProperty("id_order_change")
    private String idOrderChange;
    private String typePaiement;



    public String getComment() {
      return comment;
    }

    public void setComment(String comment) {
      this.comment = comment;
    }

    private String comment;
// Builder pour `items`

    @JsonCreator
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
      @JsonProperty("buyPrice") double buyPrice,
      @JsonProperty("items") List<ItemRequestDTO> items,
      @JsonProperty("id_order_change") String idOrderChange,
      @JsonProperty("typePaiement")String typePaiement
      // Ajout des articles
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
      this.buyPrice = buyPrice;
      this.items = items;
      this.idOrderChange=idOrderChange;
      this.typePaiement=typePaiement;
    }
    public Builder setItems(List<ItemRequestDTO> items) {
      this.items = items;
      return this;
    }

    public OrderRequestDTO buildOrder() {
      return new OrderRequestDTO(this);
    }
  }

  public static class ItemRequestDTO {
    private String nameProduct;
    private int quantity;
    private double salesPrice;
    private double totalePrice;
    private Long itemId;
    private String itemCode;
    private double negoPrice;
    private String code;


    public String getCode() {
      return code;
    }

    public void setCode(String code) {
      this.code = code;
    }

    public double getNegoPrice() {
      return negoPrice;
    }

    public void setNegoPrice(double negoPrice) {
      this.negoPrice = negoPrice;
    }


    public String getItemCode() {
      return itemCode;
    }

    public void setItemCode(String itemCode) {
      this.itemCode = itemCode;
    }



    // Getters et setters
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

    public double getSalesPrice() {
      return salesPrice;
    }

    public void setSalesPrice(double salesPrice) {
      this.salesPrice = salesPrice;
    }

    public double getTotalePrice() {
      return totalePrice;
    }

    public void setTotalePrice(double totalePrice) {
      this.totalePrice = totalePrice;
    }

    public Long getItemId() {
      return itemId;
    }

    public void setItemId(Long itemId) {
      this.itemId = itemId;
    }
  }
}

