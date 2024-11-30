package com.example.sakashop.Entities;

import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Table(name = "items")
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "price_promo")
  private String pricePromo;
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
  @Column(name = "Category")
  private String category;
  @Column(name = "Supplier")
  private String supplier;
  @UpdateTimestamp
  @Column(name="lastUpdated")
  private LocalDateTime lastUpdated;
  @Column(name = "isPromo")
  private boolean isPromo;

  public Item(Long id, String pricePromo, String itemCode, String name, int quantity, double buyPrice, double salesPrice, String category, String supplier, LocalDateTime lastUpdated, boolean isPromo, Date productAddedDate) {
    this.id = id;
    this.pricePromo = pricePromo;
    this.itemCode = itemCode;
    this.name = name;
    this.quantity = quantity;
    this.buyPrice = buyPrice;
    this.salesPrice = salesPrice;
    this.category = category;
    this.supplier = supplier;
    this.lastUpdated = lastUpdated;
    this.isPromo = isPromo;
    this.productAddedDate = productAddedDate;
  }

  public Date getproductAddedDate() {
    return productAddedDate;
  }

  public void setproductAddedDate(Date productAddedDate) {
    this.productAddedDate = productAddedDate;
  }

  @Column(name = "product_added_date")
  private Date productAddedDate;



  public void setIsPromo(boolean isPromo) {
    isPromo = isPromo;
  }

  public Item() {
  }

  public String getPricePromo() {
    return pricePromo;
  }

  public void setPricePromo(String promo) {
    this.pricePromo = promo;

    // Met automatiquement isPromo à true si pricePromo est défini
    try {
      if (pricePromo != null && !pricePromo.isEmpty()) {
        Double pricePromoValue = Double.parseDouble(pricePromo);
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

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getSupplier() {
    return supplier;
  }

  public void setSupplier(String supplier) {
    this.supplier = supplier;
  }
}
