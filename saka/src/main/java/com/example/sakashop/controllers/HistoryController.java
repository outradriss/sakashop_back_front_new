package com.example.sakashop.controllers;

import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.DTO.ProductHistoryDTO;
import com.example.sakashop.Exceptions.EntityNotFoundException;
import com.example.sakashop.services.implServices.HistoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

  private final HistoryServiceImpl historyService;

  public HistoryController(HistoryServiceImpl historyService) {
    this.historyService = historyService;
  }

  @GetMapping("/{productId}")
  public ResponseEntity<?> getProductHistory(@PathVariable Long productId) {
    try {
      List<ProductHistoryDTO> history = historyService.getProductHistory(productId);
      return ResponseEntity.ok(history);
    } catch (EntityNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + ex.getMessage());
    }
  }
  @GetMapping("/ALL")
  public ResponseEntity<?> getAllProductHistory() {
    try {
      List<OrderRequestDTO> history = historyService.getAllProductHistory();
      return ResponseEntity.ok(history);
    } catch (EntityNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + ex.getMessage());
    }
  }
  @GetMapping("/ALLToDay")
  public ResponseEntity<?> getAllProductHistoryToday() {
    try {
      List<OrderRequestDTO> history = historyService.getAllProductHistoryToday();
      return ResponseEntity.ok(history);
    } catch (EntityNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + ex.getMessage());
    }
  }

}
