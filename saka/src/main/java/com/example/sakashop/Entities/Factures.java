package com.example.sakashop.Entities;

import com.example.sakashop.Entities.FactureItem;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "factures_items",
    joinColumns = @JoinColumn(name = "facture_id"),
    inverseJoinColumns = @JoinColumn(name = "item_id")
  )
  private List<Item> items = new ArrayList<>();

  @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private List<FactureItem> factureItems;



  @ElementCollection
  @CollectionTable(name = "factures_items", joinColumns = @JoinColumn(name = "facture_id"))
  @MapKeyJoinColumn(name = "item_id")
  @Column(name = "quantity")
  private Map<Item, Integer> itemQuantities = new HashMap<>();

  public void addItemWithQuantity(Item item, int quantity) {
    this.items.add(item);
    this.itemQuantities.put(item, quantity); // ✅ Correction ici
  }


}
