package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CacheManager cacheManager;

  @Cacheable(value = "products", key = "'allProducts'")
  public List<Item> getAllProducts() {
    return productRepository.findAll();
  }



  @CacheEvict(value = "products", allEntries = true)
  public Item addProduct(Item product) {
    return productRepository.save(product);
  }

  @CacheEvict(value = "products", allEntries = true)
  public void deleteProduct(Long id) {

    productRepository.deleteById(id);
  }

  @CacheEvict(value = "products", allEntries = true)
  public Item updateProduct(Long id, Item updatedProduct) {
    Item existingProduct = productRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Produit introuvable"));
    existingProduct.setName(updatedProduct.getName());
    existingProduct.setBuyPrice(updatedProduct.getBuyPrice());
    existingProduct.setCategory(updatedProduct.getCategory());
    existingProduct.setQuantity(updatedProduct.getQuantity());
    existingProduct.setItemCode(updatedProduct.getItemCode());
    existingProduct.setSalesPrice(updatedProduct.getSalesPrice());
    existingProduct.setSupplier(updatedProduct.getSupplier());
    existingProduct.setPricePromo(updatedProduct.getPricePromo());
    existingProduct.setIsPromo(updatedProduct.getIsPromo());
    Item savedProduct = productRepository.save(updatedProduct);

    return savedProduct;
  }
}


