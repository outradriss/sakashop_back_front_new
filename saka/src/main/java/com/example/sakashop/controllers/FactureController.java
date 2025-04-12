package com.example.sakashop.controllers;

import com.example.sakashop.DAO.FactureRepository;
import com.example.sakashop.DTO.FactureDTO;
import com.example.sakashop.DTO.ItemQuantityDTO;
import com.example.sakashop.Entities.Factures;
import com.example.sakashop.services.implServices.FactureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permettre les appels depuis Angular
public class FactureController {

  private final FactureService factureService;

  private final FactureRepository factureRepository;

  public FactureController(FactureService factureService ,FactureRepository factureRepository ) {
    this.factureService = factureService;
    this.factureRepository=factureRepository;
  }

  @PostMapping("/factures")
  public ResponseEntity<Factures> enregistrerFacture(@RequestBody FactureDTO factureDTO) {
    System.out.println("Facture Reçue: " + factureDTO);

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


  @GetMapping("/factures/All")
  public ResponseEntity<List<FactureDTO>> getAllFactures() {
    return ResponseEntity.ok(factureService.getAllFactures());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Optional<Factures>> getFactureById(@PathVariable Long id) {
    return ResponseEntity.ok(factureService.getFactureById(id));
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteFactureById(@PathVariable Long id) {
    try {
      Factures deletedFacture = factureService.deleteFactureById(id);
      return ResponseEntity.ok(deletedFacture);
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }
  @PutMapping("/{id}")
  public ResponseEntity<Factures> updateFacture(@PathVariable Long id, @RequestBody Factures updatedFacture) {
    Factures facture = factureService.updateFacture(id, updatedFacture);
    return ResponseEntity.ok(facture);
  }

  @GetMapping("/factures/clients")
  public ResponseEntity<List<Map<String, Object>>> getClientsFromFactures() {
    List<Map<String, Object>> clients = factureRepository.findDistinctClients();
    return ResponseEntity.ok(clients);
  }



}
