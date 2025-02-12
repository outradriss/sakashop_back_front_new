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
  private Long id;

  @Column(name = "client_name", nullable = false)
  private String clientName;

  @Column(name = "date_credit", nullable = false)
  private LocalDate dateCredit;

  @Column(name = "date_update")
  private LocalDateTime updatedDate;

  @Column(name = "date_pay")
  private LocalDate datePayCredit;

  @Column(name = "total", nullable = false)
  private double total;

  @Column(name = "quantity", nullable = false)
  private int quantity;

  @Column(name = "comment")
  private String comment;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Item product;
}
