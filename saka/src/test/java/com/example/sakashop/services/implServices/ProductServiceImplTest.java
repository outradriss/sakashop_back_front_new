package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Categories;
import com.example.sakashop.Entities.Item;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
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
  void testGetAllProducts_CacheMiss() throws NoSuchMethodException {
    // Création de données de test
    Categories category1 = new Categories(1L, "Electronics",LocalDateTime.MAX);
    Categories category2 = new Categories(2L, "Clothing",LocalDateTime.MIN);

    Item item1 = new Item(
      1L,
      10.0,
      "ELEC001",
      "Smartphone",
      50,
      100.0,
      150.0,
      "Tech Supplier",
      category1,
      LocalDateTime.now(),
      true,
      new Date(),
      new Date()
    );
    Item item2= new Item(
      1L,
      10.0,
      "TECH002",
      "Smartphone",
      50,
      100.0,
      150.0,
      "Tech Supplier",
      category1,
      LocalDateTime.now(),
      true,
      new Date(),
      new Date()
    );
    when(productRepository.findAllWithCategory())
      .thenReturn(Arrays.asList(item1, item2));
    List<Item> result = productService.getAllProducts();
    assertNotNull(result);
    assertEquals(2, result.size());

    // Vérification des détails du premier item
    assertEquals(1L, result.get(0).getId());
    assertEquals("Smartphone", result.get(0).getName());
    assertEquals(category1, result.get(0).getCategories());

    // Vérification des détails du deuxième item
    assertEquals(2L, result.get(1).getId());
    assertEquals("T-Shirt", result.get(1).getName());
    assertEquals(category2, result.get(1).getCategories());
    Cacheable cacheableAnnotation = ProductServiceImpl.class
      .getMethod("getAllProducts")
      .getAnnotation(Cacheable.class);

    assertNotNull(cacheableAnnotation);
    assertArrayEquals(new String[]{"products"}, cacheableAnnotation.value());
    assertEquals("'allProducts'", cacheableAnnotation.key());

    // Vérification que la méthode du repository a été appelée une fois
    verify(productRepository, times(1)).findAllWithCategory();
  }


  @Test
  void testAddProduct_ShouldEvictCache() {
    Categories category1 = new Categories(1L, "Electronics",LocalDateTime.MAX);
    // Arrange
    Item newItem = new Item(1L, 0,"123456,67", "Product A", 10, 20.0, 30.0, "Supplier A",category1,LocalDateTime.MAX,false, new Date(), new Date());
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
    Categories category1 = new Categories(1L, "Electronics",LocalDateTime.MAX);
    Categories category2 = new Categories(2L, "Clothing",LocalDateTime.MIN);
    // Arrange
    Long productId = 1L;
    Item existingItem = new Item(1L, 0,"1234,67", "Product A", 10, 20.0, 30.0, "Supplier A",category1,LocalDateTime.MAX,false, new Date(), new Date());
    Item updatedItem = new Item(1L, 10,"123456,67", "Product A Updated", 5, 20.0, 50.0, "Supplier B",category2,LocalDateTime.MAX,true, new Date(), new Date());

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
