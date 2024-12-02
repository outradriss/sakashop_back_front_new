package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseOrderRepo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.Order;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CaisseServiceImplTest {

  @Autowired
  private CaisseServiceImpl caisseService;

  @MockBean
  private ProductRepository productRepository;

  @MockBean
  private CaisseOrderRepo caisseOrderRepo;

  @Test
  public void testSaveOrders() {
    OrderRequestDTO orderRequest = new OrderRequestDTO(
      null,
      "Produit Test",
      2,
      0,
      false,
      0.0,
      LocalDateTime.now(),
      LocalDateTime.now()
    );

    Item mockProduct = new Item();
    mockProduct.setName("Produit Test");
    mockProduct.setQuantity(5);

    Mockito.when(productRepository.findByName("Produit Test")).thenReturn(mockProduct);

    caisseService.saveOrders(Collections.singletonList(orderRequest));

    Mockito.verify(productRepository, Mockito.times(1)).save(mockProduct);
    Mockito.verify(caisseOrderRepo, Mockito.times(1)).save(Mockito.any(Order.class));
  }
}
