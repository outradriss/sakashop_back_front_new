package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CategoryRepo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CategoryRepo categoryRepo;

  @Autowired
  private CacheManager cacheManager;

  @Cacheable(value = "products", key = "'allProducts'")  public List<Item> getAllProducts() {

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
    existingProduct.setQuantity(updatedProduct.getQuantity());
    existingProduct.setItemCode(updatedProduct.getItemCode());
    existingProduct.setSalesPrice(updatedProduct.getSalesPrice());
    existingProduct.setSupplier(updatedProduct.getSupplier());
    existingProduct.setPricePromo(updatedProduct.getPricePromo());
    existingProduct.setIsPromo(updatedProduct.getIsPromo());
    Item savedProduct = productRepository.save(existingProduct);

    return savedProduct;
  }
}


