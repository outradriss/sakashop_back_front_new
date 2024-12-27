package com.example.sakashop.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cancel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @Column(nullable = false)
  private String reason;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now();


}
