package com.example.sakashop.controllers;

import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gestion-product")
@CrossOrigin(origins = "*")
public class ProductController {

  @Autowired
  private ProductServiceImpl productService;

  @GetMapping("/list")
  public List<Item> getAllProducts() {
    return productService.getAllProducts();
  }
  @PostMapping("/save")
  public Item saveProduct(@RequestBody Item item) {
    return productService.addProduct(item);
  }


  @PostMapping("/save/category")
  public ResponseEntity<?> saveCategory(@RequestBody Categories categories) {
    try {
      Categories savedCategory = productService.addCategory(categories);
      return ResponseEntity.ok(savedCategory);
    } catch (DataIntegrityViolationException ex) {
      if (ex.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
          .body("Vous ne pouvez pas ajouter une catégorie qui existe déjà.");
      }
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de base de données.");
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Une erreur inattendue est survenue.");
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Item> updateProduct(@PathVariable Long id, @RequestBody Item updatedProduct) {
    Item product = productService.updateProduct(id, updatedProduct);
    return ResponseEntity.ok(product);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
    productService.deleteProduct(id);
    return ResponseEntity.ok("Produit supprimé avec succès.");
  }


}
