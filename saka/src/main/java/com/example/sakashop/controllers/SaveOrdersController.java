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
  @Transactional
  public ResponseEntity<?> saveOrder(@RequestBody List<OrderRequestDTO> orders) {
    try {
      caisseService.saveOrders(orders);

      // Retournez une réponse structurée
      Map<String, Object> response = new HashMap<>();
      response.put("status", "success");
      response.put("message", "Commandes enregistrées et stock mis à jour.");
      return ResponseEntity.ok().body(response);
    } catch (RuntimeException e) {
      Map<String, Object> response = new HashMap<>();
      response.put("status", "error");
      response.put("message", "Erreur lors de l'enregistrement : " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();
      response.put("status", "error");
      response.put("message", "Erreur inattendue lors de l'enregistrement.");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }



}
