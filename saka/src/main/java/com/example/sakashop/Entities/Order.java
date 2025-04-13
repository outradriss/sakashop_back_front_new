package com.example.sakashop.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
@JsonIgnoreProperties({"itemsOrders"})
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_order")
  private Long idOrder;
  private LocalDateTime dateOrder;
  private LocalDateTime lastUpdated;
  private double totalePrice ;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "caisse_id", nullable = true)
  private Caisse caisse;

  @Column(name = "id_order_change", length = 20, unique = true) // ✅ Ajout du champ
  private String idOrderChange;
  private String comment;

  public Caisse getCaisse() {
    return caisse;
  }

  public void setCaisse(Caisse caisse) {
    this.caisse = caisse;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String commetn) {
    this.comment = commetn;
  }


  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnoreProperties("order")
  private List<ItemsOrders> itemsOrders = new ArrayList<>();

  public double getTotalePrice() {
    return totalePrice;
  }
  public String getIdOrderChange() {
    return idOrderChange;
  }


  public void setIdOrderChange(String idOrderChange) {
    this.idOrderChange = idOrderChange;
  }
  public void getIdOrderChange(String idOrderChange) {
    this.idOrderChange = idOrderChange;
  }

  public void setTotalePrice(double totalePrice) {
    this.totalePrice = totalePrice;
  }


  public Order(Long idOrder, LocalDateTime dateOrder, LocalDateTime lastUpdated,  double totalePrice, List<ItemsOrders> itemsOrders) {
    this.idOrder = idOrder;
    this.dateOrder = dateOrder;
    this.lastUpdated = lastUpdated;
    this.totalePrice = totalePrice;
    this.itemsOrders = itemsOrders;
  }

  public Long getIdOrder() {
    return idOrder;
  }

  public void setIdOrder(Long idOrder) {
    this.idOrder = idOrder;
  }

  public List<ItemsOrders> getItemsOrders() {
    return itemsOrders;
  }

  public void setItemsOrders(List<ItemsOrders> itemsOrders) {
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
