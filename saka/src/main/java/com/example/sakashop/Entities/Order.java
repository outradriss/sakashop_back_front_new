package com.example.sakashop.Entities;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_order")
  private Long idOrder;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;

  // Une commande peut avoir plusieurs ItemsOrders
  @Column(name = "id_orders_items")
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ItemsOrders> itemsOrders = new ArrayList<>();

  public List<ItemsOrders> getItemsOrders() {
    return itemsOrders;
  }

  public void setItemsOrders(List<ItemsOrders> itemsOrders) {
    this.itemsOrders = itemsOrders;
  }

  public Order(Long idOrder, LocalDateTime dateOrder, LocalDateTime lastUpdated, List<ItemsOrders> itemsOrders) {
    this.idOrder = idOrder;
    this.dateOrder = dateOrder;
    this.lastUpdated = lastUpdated;
    this.itemsOrders = itemsOrders;
  }

  public Order() {}

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
