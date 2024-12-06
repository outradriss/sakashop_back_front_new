package com.example.sakashop.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "items")
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "price_promo")
  private double pricePromo;
  @Column(name = "Item_Code")
  private String itemCode;
  @Column(name = "Item_Name")
  private String name;
  @Column(name = "Quantity")
  private int quantity;
  @Column(name = "Buy_Price")
  private double buyPrice;
  @Column(name = "Sales_Price")
  private double salesPrice;
  @Column(name = "Supplier")
  private String supplier;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "category_id", nullable = false)
  @JsonIgnore
  @JsonManagedReference
  private Categories categories;
  @UpdateTimestamp
  @Column(name="lastUpdated")
  private LocalDateTime lastUpdated;
  @Column(name = "isPromo")
  private boolean isPromo;
  @Column(name = "expiredDate")
  private Date expiredDate;
  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ItemsOrders> itemsOrders = new ArrayList<>();
  @Column(name = "product_added_date")
  private LocalDateTime productAddedDate;




  public Item(Long id, double pricePromo, String itemCode, String name, int quantity, double buyPrice, double salesPrice, String supplier, Categories categories, LocalDateTime lastUpdated, boolean isPromo, Date expiredDate, LocalDateTime productAddedDate) {
    this.id = id;
    this.pricePromo = pricePromo;
    this.itemCode = itemCode;
    this.name = name;
    this.quantity = quantity;
    this.buyPrice = buyPrice;
    this.salesPrice = salesPrice;
    this.supplier = supplier;
    this.categories = categories;
    this.lastUpdated = lastUpdated;
    this.isPromo = isPromo;
    this.expiredDate = expiredDate;
    this.productAddedDate = productAddedDate;
  }

  public LocalDateTime getProductAddedDate() {
    return productAddedDate;
  }

  public Categories getCategories() {
    return categories;
  }

  public void setCategories(Categories categories) {
    this.categories = categories;
  }

  public boolean isPromo() {
    return isPromo;
  }

  public void setPromo(boolean promo) {
    isPromo = promo;
  }

  public Date getExpiredDate() {
    return expiredDate;
  }

  public void setExpiredDate(Date expiredDate) {
    this.expiredDate = expiredDate;
  }

  public void setProductAddedDate(LocalDateTime productAddedDate) {
    this.productAddedDate = productAddedDate;
  }


  public void setIsPromo(boolean isPromo) {
    isPromo = isPromo;
  }

  public Item() {
  }

  public double getPricePromo() {
    return pricePromo;
  }

  public void setPricePromo(double promo) {
    this.pricePromo = promo;

    // Met automatiquement isPromo à true si pricePromo est défini
    try {
      if (pricePromo >0) {
        Double pricePromoValue = pricePromo;
        this.isPromo = pricePromoValue > 0;
      } else {
        this.isPromo = false;
      }
    } catch (NumberFormatException e) {
      // Gestion d'erreur si la chaîne n'est pas un nombre
      System.err.println("Erreur : pricePromo n'est pas un nombre valide.");
      this.isPromo = false;
    }
  }

  public LocalDateTime getLastUpdated() {
    return lastUpdated;
  }

  public void setLastUpdated(LocalDateTime lastUpdated) {
    this.lastUpdated = lastUpdated;
  }
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getItemCode() {
    return itemCode;
  }
  public boolean getIsPromo() {
    return isPromo;
  }

  public void setItemCode(String itemCode) {
    this.itemCode = itemCode;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public double getBuyPrice() {
    return buyPrice;
  }

  public void setBuyPrice(double buyPrice) {
    this.buyPrice = buyPrice;
  }

  public double getSalesPrice() {
    return salesPrice;
  }

  public void setSalesPrice(double salesPrice) {
    this.salesPrice = salesPrice;
  }

  public String getSupplier() {
    return supplier;
  }

  public void setSupplier(String supplier) {
    this.supplier = supplier;
  }
}
