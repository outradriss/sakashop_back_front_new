package com.example.sakashop.controllers;

import com.example.sakashop.DAO.FactureRepository;
import com.example.sakashop.DTO.ClientFactureDTO;
import com.example.sakashop.DTO.FactureDTO;
import com.example.sakashop.DTO.ItemQuantityDTO;
import com.example.sakashop.DTO.ProduitFactureDTO;
import com.example.sakashop.Entities.FactureItem;
import com.example.sakashop.Entities.Factures;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.FactureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

  private final FactureService factureService;
  private final FactureRepository factureRepository;

  public FactureController(FactureService factureService, FactureRepository factureRepository) {
    this.factureService = factureService;
    this.factureRepository = factureRepository;
  }

  // ✅ Créer une facture
  @PostMapping("")
  public ResponseEntity<Factures> enregistrerFacture(@RequestBody FactureDTO factureDTO) {
    Factures facture = new Factures();
    facture.setReference(factureDTO.getReference());
    facture.setClientName(factureDTO.getClientName());
    facture.setClientICE(factureDTO.getClientICE());
    facture.setClientCode(factureDTO.getClientCode());
    facture.setAdresse(factureDTO.getAdresse());
    facture.setEntreprise(factureDTO.getEntreprise());
    facture.setModePaiement(factureDTO.getModePaiement());
    facture.setStatusPaiement(factureDTO.getStatusPaiement());
    facture.setDateFacture(factureDTO.getDateFacture());
    facture.setDateEcheance(factureDTO.getDateEcheance());
    facture.setTotalHT(factureDTO.getTotalHT());
    facture.setTotalTVA(factureDTO.getTotalTVA());
    facture.setTotalTTC(factureDTO.getTotalTTC());

    Map<Long, ItemQuantityDTO> itemQuantities = factureDTO.getItemQuantities()
      .stream()
      .collect(Collectors.toMap(ItemQuantityDTO::getId, item -> item));

    Factures savedFacture = factureService.enregistrerFacture(facture, itemQuantities);
    return ResponseEntity.ok(savedFacture);
  }

  // ✅ Récupérer toutes les factures
  @GetMapping("/all")
  public ResponseEntity<List<FactureDTO>> getAllFactures() {
    return ResponseEntity.ok(factureService.getAllFactures());
  }

  // ✅ Récupérer une facture par ID
  @GetMapping("/{id}")
  public ResponseEntity<Optional<Factures>> getFactureById(@PathVariable Long id) {
    return ResponseEntity.ok(factureService.getFactureById(id));
  }

  // ✅ Supprimer une facture
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteFactureById(@PathVariable Long id) {
    try {
      Factures deletedFacture = factureService.deleteFactureById(id);
      return ResponseEntity.ok(deletedFacture);
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  // ✅ Mettre à jour une facture
  @PutMapping("/{id}")
  public ResponseEntity<Factures> updateFacture(@PathVariable Long id, @RequestBody Factures updatedFacture) {
    Factures facture = factureService.updateFacture(id, updatedFacture);
    return ResponseEntity.ok(facture);
  }

  // ✅ Récupérer les clients avec leurs produits depuis les factures
  @GetMapping("/clients")
  public ResponseEntity<List<ClientFactureDTO>> getClientsWithProduits() {
    List<Factures> factures = factureRepository.findAllWithItems();
    Map<String, ClientFactureDTO> clientMap = new HashMap<>();

    for (Factures facture : factures) {
      String key = facture.getClientCode();
      ClientFactureDTO dto = clientMap.computeIfAbsent(key, k -> {
        ClientFactureDTO d = new ClientFactureDTO();
        d.setClientCode(facture.getClientCode());
        d.setClientName(facture.getClientName());
        d.setClientICE(facture.getClientICE());
        d.setAdresse(facture.getAdresse());
        d.setProduits(new ArrayList<>());
        return d;
      });

      for (FactureItem fi : facture.getFactureItems()) {
        Item item = fi.getItem();
        ProduitFactureDTO p = new ProduitFactureDTO();
        p.setId(item.getId());
        p.setName(item.getName());
        p.setPrixHT(item.getBuyPrice());

        double tvaValue = 0.0;
        try {
          String tvaRaw = item.getTva() != null ? item.getTva().replace("%", "").trim() : "0";
          tvaValue = Double.parseDouble(tvaRaw);
        } catch (NumberFormatException e) {
          System.err.println("Erreur de parsing TVA pour l'item ID " + item.getId() + " : " + item.getTva());
        }

        p.setTva(tvaValue);
        double prixTTC = item.getBuyPrice() + item.getBuyPrice() * tvaValue / 100;
        p.setPrixTTC(prixTTC);
        p.setQuantity(fi.getQuantite());
        dto.getProduits().add(p);
      }
    }

    return ResponseEntity.ok(new ArrayList<>(clientMap.values()));
  }
}
