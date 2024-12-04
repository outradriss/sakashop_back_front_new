package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CategoryRepo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.productService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import org.springframework.stereotype.Service;


import java.util.List;


@Service
public class ProductServiceImpl implements productService {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CategoryRepo categoryRepo;

  @Autowired
  private CacheManager cacheManager;

  @Cacheable(value = "products", key = "'allProducts'")
  public List<Item> getAllProducts() {
    return productRepository.findAllWithCategory() ;
  }

  @CacheEvict(value = "products", allEntries = true)
  public Item addProduct(Item item) {
    Long categoryId = item.getCategories().getId();
    Categories category = categoryRepo.findById(categoryId)
      .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
    item.setCategories(category); // Associer l'entité persistante
    return productRepository.save(item);
  }
  @CacheEvict(value = "categories", allEntries = true)
  public Categories addCategory(Categories categories) {
   return categoryRepo.save(categories);
  }



  @CacheEvict(value = "products", allEntries = true)
  public void deleteProduct(Long id) {

    productRepository.deleteById(id);
  }

  @CacheEvict(value = "products", allEntries = true)
  public Item updateProduct(Long id, Item updatedProduct) {
    Item existingProduct = productRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Produit introuvable"));

    // Mise à jour des champs
    existingProduct.setName(updatedProduct.getName());
    existingProduct.setBuyPrice(updatedProduct.getBuyPrice());
    existingProduct.setQuantity(updatedProduct.getQuantity());
    existingProduct.setItemCode(updatedProduct.getItemCode());
    existingProduct.setSalesPrice(updatedProduct.getSalesPrice());
    existingProduct.setSupplier(updatedProduct.getSupplier());
    existingProduct.setPricePromo(updatedProduct.getPricePromo());
    existingProduct.setIsPromo(updatedProduct.getIsPromo());

    // Sauvegarde du produit mis à jour
    Item savedProduct = productRepository.save(existingProduct);

    return savedProduct;
  }

}


