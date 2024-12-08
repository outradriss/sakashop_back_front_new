package com.example.sakashop.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id ;
  private String nameClient;
  @Column(name = "date_credit")
  private LocalDateTime localDateTime ;
  @Column(name = "date_update")
  private LocalDateTime updatedDate ;
  @Column(name = "date_pay")
  private Date  datePayCredit ;
  @Column(name="total")
  private double totale ;
  @ManyToMany
  @JoinTable(
    name = "credit_item", // Table intermédiaire
    joinColumns = @JoinColumn(name = "credit_id"), // Colonne pour Credit
    inverseJoinColumns = @JoinColumn(name = "item_id") // Colonne pour Item
  )
  private List<Item> items = new ArrayList<>();
}
