package com.example.sakashop.controllers;


import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import com.example.sakashop.services.implServices.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/caisse")
@CrossOrigin(origins = "*")
public class SaveOrdersController {
  @Autowired
  CaisseServiceImpl caisseService;

  @Autowired
  ProductServiceImpl productService;

  @PostMapping("/saveOrder")
  public ResponseEntity<?> saveOrders(@RequestBody List<OrderRequestDTO> orders) {
    try {
      if (orders == null || orders.isEmpty()) {
        throw new IllegalArgumentException("La liste des commandes est vide.");
      }

      // Processer et sauvegarder les commandes
      caisseService.processAndSaveOrder(orders);

      return ResponseEntity.ok(Map.of(
        "status", "success",
        "message", "Commandes enregistrées avec succès."
      ));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(Map.of(
        "status", "error",
        "message", "Erreur de validation : " + e.getMessage()
      ));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "status", "error",
        "message", "Erreur inattendue lors de l'enregistrement des commandes : " + e.getMessage()
      ));
    }
  }

}

