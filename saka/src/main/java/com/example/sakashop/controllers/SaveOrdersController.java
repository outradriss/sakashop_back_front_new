package com.example.sakashop.controllers;


import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import com.example.sakashop.services.implServices.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/caisse")
@CrossOrigin(origins = "*")
public class SaveOrdersController {
  @Autowired
  CaisseServiceImpl caisseService;

  @Autowired
  ProductServiceImpl productService;

  @PostMapping("/saveOrder")
  @Transactional
  public ResponseEntity<?> saveOrder(@RequestBody List<OrderRequestDTO> orders) {
    try {
      caisseService.saveOrders(orders);
      return ResponseEntity.ok().body("Commandes enregistrées et stock mis à jour.");
    } catch (RuntimeException e) {
      // Gérer les erreurs spécifiques
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de l'enregistrement : " + e.getMessage());
    } catch (Exception e) {
      // Gérer les erreurs inattendues
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur inattendue lors de l'enregistrement.");
    }
  }


}
