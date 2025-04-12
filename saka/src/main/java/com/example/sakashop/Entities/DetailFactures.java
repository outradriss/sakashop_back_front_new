package com.example.sakashop.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailFactures {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "facture_id", nullable = false)
  private Factures facture;

  @ManyToOne
  @JoinColumn(name = "produit_id", nullable = false)
  private Item produit;

  @Column(nullable = false)
  private Integer quantite;

  @Column(nullable = false)
  private Double prixUnitaire;

  @ManyToOne
  @JoinColumn(name = "bon_de_livraison_id")
  private BonDeLivraison bonDeLivraison;

  public Double getTotalLigne() {
    return this.quantite * this.prixUnitaire;
  }
}
