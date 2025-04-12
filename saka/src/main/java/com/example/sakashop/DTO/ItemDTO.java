package com.example.sakashop.DTO;

public class ItemDTO {
  private Long id;
  private String name;
  private double salesPrice;
  private String tva;
  private int quantity;

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public String getTva() {
    return tva;
  }

  public void setTva(String tva) {
    this.tva = tva;
  }

  public double getSalesPrice() {
    return salesPrice;
  }

  public void setSalesPrice(double salesPrice) {
    this.salesPrice = salesPrice;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ItemDTO(Long id, String name, double salesPrice, String tva, int quantity) {
    this.id = id;
    this.name = name;
    this.salesPrice = salesPrice;
    this.tva = tva;
    this.quantity = quantity;
  }


}
