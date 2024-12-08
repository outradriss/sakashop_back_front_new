package com.example.sakashop.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id ;
  @Column(name = "name_client")
  private String nameClient;
  @Column(name = "date_credit")
  private LocalDate localDateTime ;
  @Column(name = "date_update")
  private LocalDateTime updatedDate ;
  @Column(name = "date_pay")
  private LocalDate  datePayCredit ;
  @Column(name="total")
  private double totale ;
  @Column(name = "quantity")
  private int quantity;
  @Column(name = "comment")
  private String comment;
  @ManyToOne
  @JoinColumn(name = "item_id" ,nullable = false)
  private Item product;
}
