package com.example.sakashop.Entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class BonLivraisonItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Double prixHT;
  private Double tva;
  private Double prixTTC;
  private Integer quantity;
  private Double totalTTC;

  @ManyToOne
  @JoinColumn(name = "item_id")
  private Item item;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "bon_livraison_id")
  private BonLivraison bonLivraison;
}
