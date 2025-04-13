package com.example.sakashop.services.implServices;


import com.example.sakashop.DAO.FactureItemREpo;
import com.example.sakashop.DAO.FactureRepository;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.FactureDTO;

import com.example.sakashop.DTO.ItemQuantityDTO;
import com.example.sakashop.Entities.FactureItem;
import com.example.sakashop.Entities.Factures;
import com.example.sakashop.Entities.Item;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FactureService {

  private final FactureRepository factureRepository;
  private final ProductRepository itemRepository;
  private final FactureItemREpo factureItemRepository;

  public FactureService(com.example.sakashop.DAO.FactureRepository factureRepository, ProductRepository itemRepository , FactureItemREpo factureItemRepository) {
    this.factureRepository = factureRepository;
    this.itemRepository = itemRepository;
    this.factureItemRepository = factureItemRepository;
  }


  @Transactional
  public Factures enregistrerFacture(Factures facture, Map<Long, ItemQuantityDTO> itemDetails) {

    // Enregistrer la facture principale d'abord
    facture = factureRepository.save(facture);

    List<FactureItem> factureItems = new ArrayList<>();

    for (Map.Entry<Long, ItemQuantityDTO> entry : itemDetails.entrySet()) {
      Long itemId = entry.getKey();
      ItemQuantityDTO dto = entry.getValue();

      Item item = itemRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item non trouvé avec ID: " + itemId));

      FactureItem factureItem = new FactureItem();
      factureItem.setFacture(facture);
      factureItem.setItem(item);
      factureItem.setQuantite(dto.getQuantite());
      factureItem.setPrixHT(dto.getPrixHT());
      factureItem.setTva(dto.getTva());
      factureItem.setPrixTTC(dto.getPrixTTC());
      factureItem.setTotalTTC(dto.getTotalTTC());

      factureItems.add(factureItem);
    }

    factureItemRepository.saveAll(factureItems);

    return facture;
  }







  public List<FactureDTO> getAllFactures() {
    List<Factures> factures = factureRepository.findAll();
    return factures.stream()
      .map(FactureDTO::new)
      .collect(Collectors.toList());
  }
  public Optional<Factures> getFactureById(Long id) {
    return factureRepository.findById(id);
  }

  public Factures deleteFactureById(Long id) {
    Optional<Factures> facture = factureRepository.findById(id);
    if (facture.isPresent()) {
      factureRepository.deleteById(id);
      return facture.get(); // Retourne la facture supprimée
    }
    throw new RuntimeException("Facture non trouvée avec l'ID : " + id);
  }

  @Transactional
  public Factures updateFacture(Long id, Factures updatedFacture) {
    Factures existingFacture = factureRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'ID : " + id));

    // Vider proprement les anciens items
    existingFacture.getFactureItems().clear();

    // Ajouter les nouveaux produits en liant chaque item à la facture
    if (updatedFacture.getFactureItems() != null) {
      for (FactureItem item : updatedFacture.getFactureItems()) {
        existingFacture.addFactureItem(item);
      }
    }

    // Mise à jour des autres champs
    existingFacture.setClientName(updatedFacture.getClientName());
    existingFacture.setClientICE(updatedFacture.getClientICE());
    existingFacture.setClientCode(updatedFacture.getClientCode());
    existingFacture.setAdresse(updatedFacture.getAdresse());
    existingFacture.setEntreprise(updatedFacture.getEntreprise());
    existingFacture.setDateFacture(updatedFacture.getDateFacture());
    existingFacture.setDateEcheance(updatedFacture.getDateEcheance());
    existingFacture.setModePaiement(updatedFacture.getModePaiement());
    existingFacture.setStatusPaiement(updatedFacture.getStatusPaiement());
    existingFacture.setTotalHT(updatedFacture.getTotalHT());
    existingFacture.setTotalTVA(updatedFacture.getTotalTVA());
    existingFacture.setTotalTTC(updatedFacture.getTotalTTC());

    return factureRepository.save(existingFacture);
  }


}
