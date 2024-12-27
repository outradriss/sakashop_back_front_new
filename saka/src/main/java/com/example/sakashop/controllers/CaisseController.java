package com.example.sakashop.controllers;

import com.example.sakashop.DTO.CancelRequestDTO;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Cancel;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.CancelService;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import com.example.sakashop.services.implServices.CancelServiceImpl;
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

  @Autowired
  private CancelServiceImpl cancelService;

  @GetMapping("/list")
  public List<Item> getAllProducts() {
    return caisseService.getAllProducts();
  }



  @PostMapping("/cancel")
  public ResponseEntity<?> createCancel(@RequestBody CancelRequestDTO dto) {
    if (dto.getItemId() != null && !dto.getItemId().isEmpty()) {
      for (Long id : dto.getItemId()) {
        Cancel cancel = new Cancel();
        Item item = new Item();
        item.setId(id); // Rattacher l'item existant
        cancel.setItem(item);
        cancel.setReason(dto.getReason());

        cancelService.saveCancel(cancel);
      }
      return ResponseEntity.ok("Cancel saved successfully for all items");
    }
    return ResponseEntity.badRequest().body("No item IDs found in request");
  }


  @GetMapping("/cancel/{itemId}")
  public ResponseEntity<List<Cancel>> getCancelsByItemId(@PathVariable Long itemId) {
    List<Cancel> cancels = cancelService.getCancelByItemId(itemId);
    return ResponseEntity.ok(cancels);
  }

}
