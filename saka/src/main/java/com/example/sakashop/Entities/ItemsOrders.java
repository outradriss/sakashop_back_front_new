package com.example.sakashop.Entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "items_orders")
public class ItemsOrders {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @ManyToOne
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @Column(nullable = false)
  private String name;

  @Column(name = "date_integration", nullable = false)
  private LocalDateTime dateIntegration;

  @Column(name = "sales_price", nullable = false)
  private double salesPrice;

  @Column(name = "date_update")
  private LocalDateTime dateUpdate;

  @Column(name = "stock_quantity", nullable = false)
  private int stockQuantity;

  @Column(name = "cart_quantity", nullable = false)
  private int cartQuantity;

  @Column(name = "nego_price", nullable = false)
  private double negoPrice;


  public ItemsOrders(Long id, Order order, Item item, String name, LocalDateTime dateIntegration, double salesPrice, LocalDateTime dateUpdate, int stockQuantity, int cartQuantity, double negoPrice) {
    this.id = id;
    this.order = order;
    this.item = item;
    this.name = name;
    this.dateIntegration = dateIntegration;
    this.salesPrice = salesPrice;
    this.dateUpdate = dateUpdate;
    this.stockQuantity = stockQuantity;
    this.cartQuantity = cartQuantity;
    this.negoPrice = negoPrice;
  }

  public ItemsOrders() {
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

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Item getItem() {
    return item;
  }

  public void setItem(Item item) {
    this.item = item;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public LocalDateTime getDateIntegration() {
    return dateIntegration;
  }

  public void setDateIntegration(LocalDateTime dateIntegration) {
    this.dateIntegration = dateIntegration;
  }

  public LocalDateTime getDateUpdate() {
    return dateUpdate;
  }

  public void setDateUpdate(LocalDateTime dateUpdate) {
    this.dateUpdate = dateUpdate;
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


}