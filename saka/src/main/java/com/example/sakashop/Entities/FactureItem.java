package com.example.sakashop.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "factures_items")
@NoArgsConstructor
@AllArgsConstructor
public class FactureItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "facture_id", nullable = false)
  @JsonIgnore
  private Factures facture;

  @ManyToOne
  @JoinColumn(name = "item_id", nullable = false)
  @JsonIgnoreProperties("factureItems")
  private Item item;

  private int quantite;
  private double prixHT;
  private double tva;
  private double prixTTC;
  private double totalTTC;
}
