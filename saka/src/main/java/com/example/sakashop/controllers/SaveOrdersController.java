package com.example.sakashop.controllers;

import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caisse")
@CrossOrigin(origins = "*")
public class SaveOrdersController {
  @Autowired
  CaisseServiceImpl caisseService;

  @PostMapping("/saveOrder")
  public ResponseEntity<?> saveOrders(@RequestBody List<OrderRequestDTO> orders) {
    try {
      caisseService.saveOrders(orders);
      return ResponseEntity.ok(Map.of(
        "status", "success",
        "message", "Commandes enregistrées avec succès."
      ));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
        "status", "error",
        "message", "Une erreur est survenue lors de l'enregistrement des commandes."
      ));
    }
  }
}
