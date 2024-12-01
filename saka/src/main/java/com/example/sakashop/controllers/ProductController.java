package com.example.sakashop.controllers;

import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
  public ResponseEntity<Categories> saveCategory(@RequestBody Categories categories) {
    Categories savedCategory = productService.addCategory(categories);
    return ResponseEntity.ok(savedCategory);
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
