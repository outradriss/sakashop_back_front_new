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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
  @Transactional(readOnly = true)
  public List<Item> getAllProducts() {
    return caisseRepo.findAllWithCategoryForCaisse();
  }



  @Transactional
  @CacheEvict(value = "products", allEntries = true)
  public void processAndSaveOrder(List<OrderRequestDTO> orderDTOList) {
    if (orderDTOList == null || orderDTOList.isEmpty()) {
      throw new IllegalArgumentException("La liste des commandes est vide.");
    }

    // Création de l'entité `Order` pour toute la commande
    Order order = new Order();
    order.setDateOrder(orderDTOList.get(0).getDateOrder());
    order.setLastUpdated(orderDTOList.get(0).getLastUpdated());
    order.setTotalePrice(orderDTOList.stream().mapToDouble(OrderRequestDTO::getTotalePrice).sum());

    // Traiter chaque article de la commande
    List<ItemsOrders> itemsOrdersList = orderDTOList.stream().map(itemDTO -> {
      // Vérification si l'ID de l'article existe en base
      Optional<Item> itemOptional = productRepository.findById(itemDTO.getItemId());
      if (itemOptional.isEmpty()) {
        throw new IllegalArgumentException("Article non trouvé : " + itemDTO.getItemId());
      }

      Item item = itemOptional.get();

      // Vérification de la disponibilité du stock
      if (item.getQuantity() < itemDTO.getQuantity()) {
        throw new IllegalStateException("Stock insuffisant pour l'article : " + itemDTO.getItemId());
      }
      // Création de l'entité `ItemsOrders`
      ItemsOrders itemsOrders = new ItemsOrders();
      itemsOrders.setOrder(order); // Associer la commande
      itemsOrders.setItem(item); // Associer l'article
      itemsOrders.setName(itemDTO.getNameProduct());
      itemsOrders.setCartQuantity(itemDTO.getQuantity());
      itemsOrders.setStockQuantity(item.getQuantity()); // Stock actuel
      itemsOrders.setSalesPrice(itemDTO.getSalesPrice());
      itemsOrders.setPromoPrice(itemDTO.getPricePromo());
      itemsOrders.setNegoPrice(itemDTO.getNegoPrice());
      itemsOrders.setDateIntegration(LocalDateTime.now()); // Date actuelle pour l'intégration

      return itemsOrders;
    }).collect(Collectors.toList());

    if (itemsOrdersList.isEmpty()) {
      throw new IllegalArgumentException("Aucun article valide à traiter dans la commande.");
    }

    // Associer les articles à la commande
    order.setItemsOrders(itemsOrdersList);

    // Sauvegarder la commande avec ses articles
    caisseOrderRepo.save(order);
  }

  @Transactional
  @CacheEvict(value = "products", allEntries = true)
  public void processOrderFromKafka(OrderRequestDTO orderDTO) {
    if (orderDTO == null) {
      throw new IllegalArgumentException("La commande est nulle.");
    }
    // Étape 1 : Récupérer ItemsOrders avec l'article lié via order_id
    ItemsOrders itemsOrders = productRepository.findByOrderIdWithItem(orderDTO.getIdOrder())
      .orElseThrow(() -> new IllegalArgumentException("Aucun article trouvé pour l'ID de commande : " + orderDTO.getIdOrder()));

    Item item = itemsOrders.getItem(); // Article associé
    int cartQuantity = itemsOrders.getCartQuantity(); // Quantité commandée depuis ItemsOrders

    // Étape 2 : Vérifier la disponibilité du stock
    if (item.getQuantity() < cartQuantity) {
      throw new IllegalStateException("Stock insuffisant pour l'article : " + item.getId());
    }

    // Étape 3 : Mise à jour du stock (quantity = quantity - cartQuantity)
    updateProductStock(item, cartQuantity);

    System.out.println("Commande traitée avec succès pour order_id : " + orderDTO.getIdOrder());
  }

  private void updateProductStock(Item item, int cartQuantity) {
    int updatedStock = item.getQuantity() - cartQuantity;
    if (updatedStock < 0) {
      throw new IllegalStateException("Stock insuffisant après décrémentation pour l'article : " + item.getId());
    }
    item.setQuantity(updatedStock);
    productRepository.save(item); // Mettre à jour la quantité en stock
  }
}
