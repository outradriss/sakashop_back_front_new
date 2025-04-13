package com.example.sakashop.controllers;

import com.example.sakashop.DTO.BonLivraisonDTO;
import com.example.sakashop.services.implServices.BonLivraisonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bl")
@CrossOrigin(origins = "*")
public class BonLivraisonContoller {

  @Autowired
  private BonLivraisonService bonLivraisonService;

  // ✅ Enregistrer un bon de livraison
  @PostMapping("/create")
  public ResponseEntity<BonLivraisonDTO> createBonLivraison(@RequestBody BonLivraisonDTO dto) {
    BonLivraisonDTO saved = bonLivraisonService.saveBonLivraison(dto);
    return ResponseEntity.ok(saved);
  }

  // ✅ Récupérer tous les bons de livraison
  @GetMapping("/all")
  public ResponseEntity<List<BonLivraisonDTO>> getAllBonLivraison() {
    List<BonLivraisonDTO> list = bonLivraisonService.getAllBonLivraison();
    return ResponseEntity.ok(list);
  }

  // ✅ Supprimer un bon de livraison
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteBonLivraison(@PathVariable Long id) {
    bonLivraisonService.deleteBonLivraison(id);
    return ResponseEntity.noContent().build();
  }

  // ✅ Récupérer un bon par ID (pour édition)
  @GetMapping("/{id}")
  public ResponseEntity<BonLivraisonDTO> getOne(@PathVariable Long id) {
    BonLivraisonDTO dto = bonLivraisonService.getBonLivraisonById(id);
    return ResponseEntity.ok(dto);
  }

  // ✅ Mettre à jour un bon de livraison
  @PutMapping("/update/{id}")
  public ResponseEntity<BonLivraisonDTO> updateBonLivraison(@PathVariable Long id, @RequestBody BonLivraisonDTO dto) {
    BonLivraisonDTO updated = bonLivraisonService.updateBonLivraison(id, dto);
    return ResponseEntity.ok(updated);
  }
}
