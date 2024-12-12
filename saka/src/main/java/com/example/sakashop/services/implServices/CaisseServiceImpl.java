package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseOrderRepo;
import com.example.sakashop.DAO.CaisseRepo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.Exceptions.EntityNotFoundException;
import com.example.sakashop.Exceptions.InsufficientStockException;
import com.example.sakashop.services.caisseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaisseServiceImpl implements caisseService {
   // kafkaTemplate c'est l'outil principal pour envoyer des messages à kafka
  private final KafkaTemplate<String, Object> kafkaTemplate;

  @Value("${spring.kafka.topic.orders.name}")
  private String ordersTopic;

  public CaisseServiceImpl(KafkaTemplate<String, Object> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Autowired
  CaisseRepo caisseRepo;

  @Autowired
  CaisseOrderRepo caisseOrderRepo;

  @Autowired
  ProductRepository productRepository;
  @Autowired
  ItemsOrdersREpo itemsOrdersREpo;

  @Override
  @Cacheable(value = "products", key = "'allProducts'")
  public List<Item> getAllProducts() {
    return caisseRepo.findAllWithCategoryForCaisse();
  }


  @CacheEvict(value = "products", allEntries = true)
  @Transactional
  public void saveOrders(List<OrderRequestDTO> orders) {
    if (orders == null || orders.isEmpty()) {
      throw new IllegalArgumentException("La liste des commandes est vide ou nulle.");
    }

    try {
      // Parcourir les commandes pour les envoyer au Producer Kafka
      orders.forEach(orderDTO -> {
        kafkaTemplate.send(ordersTopic, orderDTO);
      });

      System.out.println("Toutes les commandes ont été publiées avec succès dans Kafka.");

    } catch (Exception e) {
      throw new RuntimeException("Erreur critique lors de l'envoi des commandes dans Kafka.", e);
    }
  }



  private void updateProductStock(Item item, int quantityOrdered) {
    try {
      int updatedStock = item.getQuantity() - quantityOrdered;
      if (updatedStock < 0) {
        throw new InsufficientStockException("Stock insuffisant pour l'item : " + item.getName());
      }
      item.setQuantity(updatedStock);
      productRepository.save(item); // Mise à jour de la quantité en stock
    } catch (InsufficientStockException e) {
      System.err.println("Erreur de stock : " + e.getMessage());
      throw e; // Propager pour gestion ultérieure
    } catch (Exception e) {
      System.err.println("Erreur inattendue lors de la mise à jour du stock : " + e.getMessage());
      throw new RuntimeException("Erreur lors de la mise à jour du stock.", e);
    }
  }

}

