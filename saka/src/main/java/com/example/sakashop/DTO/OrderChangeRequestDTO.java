package com.example.sakashop.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderChangeRequestDTO {

  @JsonProperty("idOrderChange")
  private String idOrderChange;

  // ✅ Produit sélectionné (nouveau)
  @JsonProperty("newItemCode")
  private String newItemCode;

  @JsonProperty("newNameProduct")
  private String newNameProduct;

  // ✅ Produit à remplacer (ancien)
  @JsonProperty("oldItemCode")
  private String oldItemCode;

  @JsonProperty("oldNameProduct")
  private String oldNameProduct;

  // ✅ Constructeurs, Getters et Setters
  public String getIdOrderChange() {
    return idOrderChange;
  }

  public void setIdOrderChange(String idOrderChange) {
    this.idOrderChange = idOrderChange;
  }

  public String getNewItemCode() {
    return newItemCode;
  }

  public void setNewItemCode(String newItemCode) {
    this.newItemCode = newItemCode;
  }

  public String getNewNameProduct() {
    return newNameProduct;
  }

  public void setNewNameProduct(String newNameProduct) {
    this.newNameProduct = newNameProduct;
  }

  public String getOldItemCode() {
    return oldItemCode;
  }

  public void setOldItemCode(String oldItemCode) {
    this.oldItemCode = oldItemCode;
  }

  public String getOldNameProduct() {
    return oldNameProduct;
  }

  public void setOldNameProduct(String oldNameProduct) {
    this.oldNameProduct = oldNameProduct;
  }
}
