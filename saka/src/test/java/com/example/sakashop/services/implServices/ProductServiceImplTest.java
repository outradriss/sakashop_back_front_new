package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Item;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

  @Mock
  private ProductRepository productRepository;

  @Mock
  private CacheManager cacheManager;

  @Mock
  private Cache cache;

  @InjectMocks
  private ProductServiceImpl productService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    when(cacheManager.getCache("products")).thenReturn(cache); // Simule le cache
    doNothing().when(cache).clear();

  }

  @Test
  void testGetAllProducts_CacheMiss() {
    // Arrange
    LocalDateTime lastUpdatedInDb = LocalDateTime.now();
    when(productRepository.findLastUpdateTimestamp()).thenReturn(lastUpdatedInDb);
    when(cache.get("lastUpdated", LocalDateTime.class)).thenReturn(null);

    List<Item> mockItems = Arrays.asList(
      new Item(1L, "12345667", "Product A", 10, 20.0, 30.0, "Category A", "Supplier A"),
      new Item(2L, "12345667d", "Product B", 5, 15.0, 25.0, "Category B", "Supplier B")
    );
    when(productRepository.findAll()).thenReturn(mockItems);

    // Act
    List<Item> result = productService.getAllProducts();

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    verify(cache, times(1)).put("lastUpdated", lastUpdatedInDb);
    verify(cache, times(1)).put("allProducts", mockItems); // Ajoutez cette vérification
  }


  @Test
  void testAddProduct_ShouldEvictCache() {
    // Arrange
    Item newItem = new Item(1L, "123456,67", "Product A", 10, 20.0, 30.0, "Category A", "Supplier A");
    when(productRepository.save(newItem)).thenReturn(newItem);

    // Act
    Item result = productService.addProduct(newItem);

    // Assert
    assertNotNull(result);
    verify(productRepository, times(1)).save(newItem);
    verify(cache, times(1)).clear(); // Vérifie que le cache a été vidé
  }


  @Test
  void testDeleteProduct_ShouldEvictCache() {
    // Arrange
    Long productId = 1L;
    doNothing().when(productRepository).deleteById(productId);

    // Act
    productService.deleteProduct(productId);

    // Assert
    verify(productRepository, times(1)).deleteById(productId);
    verify(cacheManager.getCache("products"), times(1)).clear();
  }

  @Test
  void testUpdateProduct_ShouldEvictCache() {
    // Arrange
    Long productId = 1L;
    Item existingItem = new Item(1L,"12", "Product A", 10, 20.0, 30.0, "Category A", "Supplier A");
    Item updatedItem = new Item(1L,"ASD34", "Product A Updated", 15, 25.0, 35.0, "Category A", "Supplier A");

    when(productRepository.findById(productId)).thenReturn(Optional.of(existingItem));
    when(productRepository.save(existingItem)).thenReturn(updatedItem);

    // Act
    Item result = productService.updateProduct(productId, updatedItem);

    // Assert
    assertNotNull(result);
    assertEquals("Product A Updated", result.getName());
    verify(productRepository, times(1)).findById(productId);
    verify(productRepository, times(1)).save(existingItem);
    verify(cacheManager.getCache("products"), times(1)).clear();
  }
}
