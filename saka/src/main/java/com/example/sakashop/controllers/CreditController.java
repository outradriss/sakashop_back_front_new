package com.example.sakashop.controllers;


import com.example.sakashop.DTO.CreditDTO;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Exceptions.ResourceNotFoundException;
import com.example.sakashop.services.implServices.CreditServicImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

  @PostMapping("/save")
  public ResponseEntity<?> createCredit(@Validated @RequestBody CreditDTO creditRequest) {
    try {
      Credit createdCredit = creditService.createCredit(creditRequest);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdCredit);
    } catch (ResourceNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Une erreur inattendue s'est produite lors de la création du crédit.");
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
