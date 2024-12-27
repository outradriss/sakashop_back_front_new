package com.example.sakashop.DTO;

import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.ItemsOrders;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name="items")
public class ItemCaisseDTO {
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
  @Version
  private int version;
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
  private LocalDate expiredDate;
  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ItemsOrders> itemsOrders = new ArrayList<>();
  @Column(name = "product_added_date")
  private LocalDateTime productAddedDate;

}
