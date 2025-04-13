package com.example.sakashop.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "factures")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Factures {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String reference;
  private String clientName;
  private String clientICE;
  private String clientCode;
  private String adresse;
  private String entreprise;
  private String modePaiement;

  @Column(name = "status")
  private String statusPaiement;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate dateFacture;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate dateEcheance;

  private double totalHT;
  private double totalTVA;
  private double totalTTC;

  @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  private List<FactureItem> factureItems = new ArrayList<>();


  public void addFactureItem(FactureItem item) {
    factureItems.add(item);
    item.setFacture(this);
  }

  public void removeFactureItem(FactureItem item) {
    factureItems.remove(item);
    item.setFacture(null);
  }
}
