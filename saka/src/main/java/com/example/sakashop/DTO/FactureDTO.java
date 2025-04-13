package com.example.sakashop.DTO;

import com.example.sakashop.Entities.Factures;
import com.example.sakashop.Entities.Item;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@NoArgsConstructor
@AllArgsConstructor
public class FactureDTO {
  private Long id;
  private String reference;
  private String clientName;
  private String clientICE;
  private String clientCode;
  private String adresse;
  private String entreprise;
  private String modePaiement;
  private String statusPaiement;
  private LocalDate dateFacture;
  private LocalDate dateEcheance;
  private double totalHT;
  private double totalTVA;
  private double totalTTC;
  private List<ItemDTO> items;

  private List<ItemQuantityDTO> itemQuantities;

  public List<ItemQuantityDTO> getItemQuantities() {
    return itemQuantities;
  }

  public void setItemQuantities(List<ItemQuantityDTO> itemQuantities) {
    this.itemQuantities = itemQuantities;
  }


  public FactureDTO(Factures facture) {
    this.id = facture.getId();
    this.reference = facture.getReference();
    this.clientName = facture.getClientName();
    this.clientICE = facture.getClientICE();
    this.clientCode = facture.getClientCode();
    this.adresse = facture.getAdresse();
    this.entreprise = facture.getEntreprise();
    this.modePaiement = facture.getModePaiement();
    this.statusPaiement = facture.getStatusPaiement();
    this.dateFacture = facture.getDateFacture();
    this.dateEcheance = facture.getDateEcheance();
    this.totalHT = facture.getTotalHT();
    this.totalTVA = facture.getTotalTVA();
    this.totalTTC = facture.getTotalTTC();


    this.itemQuantities = facture.getFactureItems().stream()
      .map(factureItem -> new ItemQuantityDTO(
        factureItem.getItem().getId(),
        factureItem.getItem().getName(),
        factureItem.getQuantite(),
        factureItem.getPrixHT(),
        factureItem.getTva(),
        factureItem.getPrixTTC(),
        factureItem.getTotalTTC()
      ))
      .collect(Collectors.toList());
  }
    public List<ItemDTO> getItems() {
    return items;
  }

  public void setItems(List<ItemDTO> items) {
    this.items = items;
  }

  public double getTotalTTC() {
    return totalTTC;
  }

  public void setTotalTTC(double totalTTC) {
    this.totalTTC = totalTTC;
  }

  public double getTotalTVA() {
    return totalTVA;
  }

  public void setTotalTVA(double totalTVA) {
    this.totalTVA = totalTVA;
  }

  public double getTotalHT() {
    return totalHT;
  }

  public void setTotalHT(double totalHT) {
    this.totalHT = totalHT;
  }

  public LocalDate getDateEcheance() {
    return dateEcheance;
  }

  public void setDateEcheance(LocalDate dateEcheance) {
    this.dateEcheance = dateEcheance;
  }

  public LocalDate getDateFacture() {
    return dateFacture;
  }

  public void setDateFacture(LocalDate dateFacture) {
    this.dateFacture = dateFacture;
  }

  public String getStatusPaiement() {
    return statusPaiement;
  }

  public void setStatusPaiement(String statusPaiement) {
    this.statusPaiement = statusPaiement;
  }

  public String getModePaiement() {
    return modePaiement;
  }

  public void setModePaiement(String modePaiement) {
    this.modePaiement = modePaiement;
  }

  public String getEntreprise() {
    return entreprise;
  }

  public void setEntreprise(String entreprise) {
    this.entreprise = entreprise;
  }

  public String getAdresse() {
    return adresse;
  }

  public void setAdresse(String adresse) {
    this.adresse = adresse;
  }

  public String getClientCode() {
    return clientCode;
  }

  public void setClientCode(String clientCode) {
    this.clientCode = clientCode;
  }

  public String getClientICE() {
    return clientICE;
  }

  public void setClientICE(String clientICE) {
    this.clientICE = clientICE;
  }

  public String getClientName() {
    return clientName;
  }

  public void setClientName(String clientName) {
    this.clientName = clientName;
  }

  public String getReference() {
    return reference;
  }

  public void setReference(String reference) {
    this.reference = reference;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
