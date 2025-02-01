package com.example.sakashop.Entities;


import javax.persistence.*;

@Entity
@Table(name = "history")
public class History {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "items_orders_id", nullable = false)
  private ItemsOrders itemsOrders;

  @Column(name = "added_quantity", nullable = false)
  private int addedQuantity;

  // Getters et Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Item getItem() {
    return item;
  }

  public void setItem(Item item) {
    this.item = item;
  }

  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public ItemsOrders getItemsOrders() {
    return itemsOrders;
  }

  public void setItemsOrders(ItemsOrders itemsOrders) {
    this.itemsOrders = itemsOrders;
  }

  public int getAddedQuantity() {
    return addedQuantity;
  }

  public void setAddedQuantity(int addedQuantity) {
    this.addedQuantity = addedQuantity;
  }

  public History(Long id, Item item, Order order, ItemsOrders itemsOrders, int addedQuantity) {
    this.id = id;
    this.item = item;
    this.order = order;
    this.itemsOrders = itemsOrders;
    this.addedQuantity = addedQuantity;
  }
}
