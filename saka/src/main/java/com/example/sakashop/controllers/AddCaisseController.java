package com.example.sakashop.controllers;

import com.example.sakashop.DTO.AddCaisseDTO;
import com.example.sakashop.Entities.Caisse;
import com.example.sakashop.services.implServices.AddCaisse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AddCaisseController {

  @Autowired
  private AddCaisse caisseService;

  /**
   * Endpoint pour ajouter une nouvelle caisse
   *
   * @param caisseDTO Les données de la caisse envoyées depuis le frontend
   * @return ResponseEntity avec le statut et les détails de la caisse ajoutée
   */
  @PostMapping("/add-caisse")
  public ResponseEntity<?> addCaisse(@RequestBody AddCaisseDTO caisseDTO) {
    try {
      // Appeler le service pour ajouter une caisse
      Caisse savedCaisse = caisseService.addCaisse(caisseDTO);
      return ResponseEntity.ok(savedCaisse); // Retourne la caisse ajoutée avec statut 200
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body("Erreur lors de l'ajout de la caisse : " + e.getMessage());
    }
  }
  @GetMapping("/all")
  public ResponseEntity<List<Caisse>> getAllCaisses() {
    try {
      List<Caisse> caisses = caisseService.getAllCaisses();
      return ResponseEntity.ok(caisses);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Collections.emptyList());
    }
  }

  @DeleteMapping("/caisses/{id}")
  public ResponseEntity<?> deleteCaisse(@PathVariable Long id) {
    try {
      caisseService.deleteCaisseById(id);
      return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Impossible de supprimer la caisse")) {
        // Message métier contrôlé
        return ResponseEntity.ok(Map.of("status", "warning", "message", e.getMessage()));
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Erreur lors de la suppression : " + e.getMessage());
      }
    }
  }


  @PutMapping("/caisses/{id}")
  public ResponseEntity<?> updateCaisse(@PathVariable Long id, @RequestBody AddCaisseDTO caisseDTO) {
    try {
      Caisse updated = caisseService.updateCaisse(id, caisseDTO);
      return ResponseEntity.ok(updated);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body("Erreur lors de la mise à jour : " + e.getMessage());
    }
  }

}
