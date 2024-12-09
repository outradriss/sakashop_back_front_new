package com.example.sakashop.controllers;


import com.example.sakashop.DTO.CreditDTO;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Exceptions.*;
import com.example.sakashop.services.implServices.CreditServicImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/credit-client")
@CrossOrigin(origins = "*")
public class CreditController {

  private static final Logger logger = LoggerFactory.getLogger(CreditController.class);


  @Autowired
  CreditServicImpl creditService;


  @GetMapping("/all")
  public List<Item> getAllProductCredit (){

   return creditService.getAll();

  }

  /**
   * Crée un nouveau crédit.
   *
   * @param creditRequest Les données de la requête pour le crédit.
   * @return ResponseEntity contenant le crédit créé ou une description de l'erreur.
   */

  @PostMapping("/save")
  public ResponseEntity<?> createCredit(@Validated @RequestBody CreditDTO creditRequest) {
    try {
      Credit createdCredit = creditService.createCredit(creditRequest);
      return ResponseEntity.ok(createdCredit);
    } catch (ResourceNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        new ErrorResponse(ex.getMessage(), "RESOURCE_NOT_FOUND"));
    } catch (InvalidDataException ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
        new ErrorResponse(ex.getMessage(), "INVALID_DATA"));
    } catch (DatabaseException ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
        new ErrorResponse(ex.getMessage(), "DATABASE_ERROR"));
    }
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateCredit(@PathVariable Long id, @Validated @RequestBody CreditDTO creditRequest) {
    try {
      Credit updatedCredit = creditService.updateCredit(id, creditRequest);
      return ResponseEntity.ok(updatedCredit);
    } catch (ResourceNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        new ErrorResponse(ex.getMessage(), "RESOURCE_NOT_FOUND"));
    } catch (InvalidDataException ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
        new ErrorResponse(ex.getMessage(), "INVALID_DATA"));
    } catch (DatabaseException ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
        new ErrorResponse(ex.getMessage(), "DATABASE_ERROR"));
    }
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteCredit(@PathVariable Long id) {
    try {
      creditService.deleteCredit(id);
      return ResponseEntity.ok(Map.of(
        "message", "Crédit supprimé avec succès",
        "timestamp", LocalDateTime.now()
      ));
    } catch (ResourceNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
        "message", ex.getMessage(),
        "errorType", "RESOURCE_NOT_FOUND",
        "timestamp", LocalDateTime.now()
      ));
    } catch (InvalidDataException ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
        "message", ex.getMessage(),
        "errorType", "INVALID_DATA",
        "timestamp", LocalDateTime.now()
      ));
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "message", "Une erreur interne s'est produite.",
        "errorType", "DATABASE_ERROR",
        "timestamp", LocalDateTime.now()
      ));
    }
  }




  @DeleteMapping("/credits/{id}")
  public ResponseEntity<?> payeCredit(@PathVariable Long id) {
    try {
      creditService.payCredit(id);
      return ResponseEntity.ok(Map.of(
        "message", "Crédit supprimé avec succès, quantité mise à jour.",
        "timestamp", LocalDateTime.now()
      ));
    } catch (ResourceNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
        "error", ex.getMessage(),
        "timestamp", LocalDateTime.now()
      ));
    } catch (IllegalStateException ex) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
        "error", ex.getMessage(),
        "timestamp", LocalDateTime.now()
      ));
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "error", "Une erreur inattendue est survenue.",
        "timestamp", LocalDateTime.now()
      ));
    }
  }



  @GetMapping("/list")
  public ResponseEntity<?> getAllCredits() {
    try {
      List<Credit> credits = creditService.getAllCredits();
      if (credits.isEmpty()) {
        return ResponseEntity.noContent().build(); // Retourner une réponse 204 No Content si aucune donnée n'est trouvée
      }
      return ResponseEntity.ok(credits); // Retourner les crédits si tout va bien
    } catch (Exception ex) {
      // Log l'erreur pour le diagnostic
      logger.error("Erreur lors de la récupération des crédits : {}", ex.getMessage(), ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Une erreur s'est produite lors de la récupération des crédits.");
    }
  }
}
