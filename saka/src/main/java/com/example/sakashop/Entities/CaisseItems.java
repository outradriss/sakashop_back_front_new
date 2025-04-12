package com.example.sakashop.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "caisse_items")
public class CaisseItems {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @Column(nullable = false)
  private String code;

  @Column(nullable = false)
  private double prix;

  @Column
  private double remise;

  @ManyToOne(fetch = FetchType.LAZY) // Relation avec Categories
  @JoinColumn(name = "categorie_id", nullable = false)
  private Categories categorie;

  @ManyToOne(fetch = FetchType.LAZY) // Relation avec la caisse
  @JoinColumn(name = "caisse_id", nullable = false) // Colonne pour la clé étrangère
  private Caisse caisse;
}
