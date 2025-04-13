package com.example.sakashop.Entities;



import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class BonLivraison {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String reference;
  private String clientName;
  private String clientICE;
  private String adresse;
  private LocalDate dateLivraison;

  private Double totalHT;
  private Double totalTVA;
  private Double totalTTC;

  @OneToMany(mappedBy = "bonLivraison", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<BonLivraisonItem> items = new ArrayList<>();

  public void addItem(BonLivraisonItem item) {
    item.setBonLivraison(this);
    items.add(item);
  }

  public void removeItem(BonLivraisonItem item) {
    item.setBonLivraison(null);
    items.remove(item);
  }
}
