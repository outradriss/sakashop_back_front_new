package com.example.sakashop.controllers;

import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/caisse")
@CrossOrigin(origins = "*")
public class CaisseController {

   @Autowired
   CaisseServiceImpl caisseService;

  @GetMapping("/list")
  public List<Item> getAllProducts() {
    return caisseService.getAllProducts();
  }


  /*@PostMapping("/validateStock")
  public ResponseEntity<String> validateStock(@RequestBody List<OrderRequestDTO> orders) {
    try {
      for (OrderRequestDTO order : orders) {
        Optional<Item> itemOptional =pro.findById(order.getItemId());
        if (itemOptional.isEmpty()) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Article non trouvé : " + order.getItemId());
        }
        Item item = itemOptional.get();
        if (item.getQuantity() < order.getQuantity()) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body("Stock insuffisant pour l'article : " + order.getItemId());
        }
      }
      return ResponseEntity.ok("Le stock est suffisant pour tous les articles.");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue est survenue.");
    }
  }*/


}
