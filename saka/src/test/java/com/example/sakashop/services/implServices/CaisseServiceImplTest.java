package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseOrderRepo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.Exceptions.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CaisseServiceImplTest {

  @Autowired
  private CaisseServiceImpl caisseService;

  @MockBean
  private ProductRepository productRepository;

  @MockBean
  private CaisseOrderRepo caisseOrderRepo;
  @Autowired
  private com.example.sakashop.services.productService productService;
  @Autowired
  private ItemsOrdersREpo itemsOrdersREpo;

  @Test
  public void testSaveOrders() {
    // Arrange: Création d'une liste de commandes avec le Builder
    List<OrderRequestDTO> orderRequestDTOS = List.of(
      new OrderRequestDTO.Builder()
        .setItemId(1L)
        .setQuantity(2)
        .setNegoPrice(85.0)
        .setIsPromo(true)
        .setPricePromo(90.0)
        .setSalesPrice(100.0)
        .setDateOrder(LocalDateTime.now())
        .setLastUpdated(LocalDateTime.now())
        .build()
    );

    Item mockItem = new Item();
    mockItem.setId(1L);
    mockItem.setName("Produit 1");
    mockItem.setQuantity(10);
    Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(mockItem));

    Order mockOrder = new Order();
    mockOrder.setIdOrder(1L);
    Mockito.when(caisseOrderRepo.save(Mockito.any(Order.class))).thenReturn(mockOrder);

    // Act
    caisseService.(orderRequestDTOS);

    // Assert
    Mockito.verify(productRepository).findById(1L);
    Mockito.verify(caisseOrderRepo).save(Mockito.any(Order.class));
    Mockito.verify(itemsOrdersREpo).saveAll(Mockito.anyList());
  }

  @Test
  void testSaveOrders_emptyOrderList() {
    // Arrange
    List<OrderRequestDTO> emptyOrders = new ArrayList<>();

    // Act & Assert
    IllegalArgumentException exception = Assertions.assertThrows(
      IllegalArgumentException.class,
      () -> caisseService.saveOrders(emptyOrders)
    );

    Assertions.assertEquals("La liste des commandes est vide.", exception.getMessage());
  }

  @Test
  void testSaveOrders_itemNotFound() {
    List<OrderRequestDTO> orderRequestDTOS = List.of(
      new OrderRequestDTO.Builder()
        .setItemId(1L)
        .setQuantity(2)
        .setNegoPrice(85.0)
        .setIsPromo(true)
        .setPricePromo(90.0)
        .setSalesPrice(100.0)
        .setDateOrder(LocalDateTime.now())
        .setLastUpdated(LocalDateTime.now())
        .build()
    );
    Mockito.when(productRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    EntityNotFoundException exception = Assertions.assertThrows(
      EntityNotFoundException.class,
      () -> caisseService.saveOrders(orderRequestDTOS)
    );

    Assertions.assertEquals("Item introuvable avec l'ID : 1", exception.getMessage());
  }
}
