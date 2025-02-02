package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.*;
import com.example.sakashop.DTO.OrderItemDTO;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.Entities.PasswordLockCaisse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CaisseServiceImpl {
  private static final Logger logger = LoggerFactory.getLogger(CaisseServiceImpl.class);

  @Autowired
  CaisseRepo caisseRepo;

  @Autowired
  CaisseOrderRepo caisseOrderRepo;

  @Autowired
  ProductRepository productRepository;

  @Autowired
  ItemsOrdersREpo itemsOrdersREpo;

  @Autowired
  PasswordLockCaisseRepo passwordLockCaisseRepo;

  //@Cacheable(value = "products", key = "'allProducts'")
  @Transactional(readOnly = true)
  public List<Item> getAllProducts() {
    return caisseRepo.findAllWithCategoryForCaisse();
  }

  public PasswordLockCaisse verifyPassword(String password) {
    PasswordLockCaisse lockCaisse = passwordLockCaisseRepo.findByPassword(password);
    if (lockCaisse == null) {
      throw new RuntimeException("Mot de passe incorrect !");
    }
    return lockCaisse;
  }
  @Transactional
  @CacheEvict(value = "products",  key = "'allProducts'",allEntries = true)
  public void processAndSaveOrder(List<OrderRequestDTO> orderDTOList) {
    if (orderDTOList == null || orderDTOList.isEmpty()) {
      throw new IllegalArgumentException("La liste des commandes est vide.");
    }

    // Préparer une commande
    for (OrderRequestDTO orderDTO : orderDTOList) {
      processSingleOrder(orderDTO);
      // Récupérer l'article et mettre à jour son stock
    }
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @CacheEvict(value = "products",  key = "'allProducts'",allEntries = true)


  public void processSingleOrder(OrderRequestDTO orderDTO) {
    long startTime = System.currentTimeMillis();
    try {
      // Vérification des données d'entrée
      if (orderDTO == null) {
        logger.error("OrderRequestDTO est nul.");
        throw new IllegalArgumentException("L'ordre fourni est nul.");
      }
      if (orderDTO.getItemId() == null || orderDTO.getItemId() <= 0) {
        logger.error("ID de l'article invalide : {}", orderDTO.getItemId());
        throw new IllegalArgumentException("ID de l'article invalide : " + orderDTO.getItemId());
      }
      if (orderDTO.getQuantity() <= 0) {
        logger.error("Quantité invalide pour l'article : {}", orderDTO.getItemId());
        throw new IllegalArgumentException("Quantité invalide pour l'article : " + orderDTO.getItemId());
      }

      // Récupérer l'article
      Optional<Item> itemOptional = productRepository.findById(orderDTO.getItemId());
      if (itemOptional.isEmpty()) {
        logger.error("Article non trouvé : {}", orderDTO.getItemId());
        throw new IllegalArgumentException("Article non trouvé : " + orderDTO.getItemId());
      }

      Item item = itemOptional.get();

      // Vérification et mise à jour du champ 'name'
      if (item.getName() == null || item.getName().isEmpty()) {
        item.setName(orderDTO.getNameProduct());
        logger.warn("Nom de l'article mis à jour depuis le DTO : {}", orderDTO.getNameProduct());
      }

      // Vérification du stock disponible
      if (item.getQuantity() < orderDTO.getQuantity()) {
        logger.warn("Stock insuffisant pour l'article : {}", item.getId());
        throw new IllegalStateException("Stock insuffisant pour l'article : " + item.getId());
      }

      // Mise à jour du stock
      int updatedStock = item.getQuantity() - orderDTO.getQuantity();
      item.setQuantity(updatedStock);

      // Sauvegarder l'article avec versionning
      productRepository.save(item);
      logger.info("Stock mis à jour avec succès pour l'article : {}. Stock actuel : {}", item.getId(), item.getQuantity());

      // Créer une nouvelle commande
      Order order = new Order();
      order.setDateOrder(orderDTO.getDateOrder());
      order.setLastUpdated(orderDTO.getLastUpdated());
      order.setTotalePrice(orderDTO.getTotalePrice());
      order.setIdOrderChange(orderDTO.getIdOrderChange());
      order.setComment(orderDTO.getComment());


      // Associer les articles à la commande
      ItemsOrders itemsOrders = new ItemsOrders();
      itemsOrders.setOrder(order);
      itemsOrders.setItem(item);
      itemsOrders.setCartQuantity(orderDTO.getQuantity());
      itemsOrders.setStockQuantity(item.getQuantity());
      itemsOrders.setSalesPrice(orderDTO.getSalesPrice());
      itemsOrders.setPromoPrice(orderDTO.getPricePromo());
      itemsOrders.setNegoPrice(orderDTO.getNegoPrice());
      itemsOrders.setDateIntegration(LocalDateTime.now());
      itemsOrders.setName(item.getName());
      itemsOrders.setIdOrderChange(orderDTO.getIdOrderChange());

      order.setItemsOrders(List.of(itemsOrders));

      // Sauvegarder la commande
      caisseOrderRepo.save(order);

      long endTime = System.currentTimeMillis();
      logger.info("Commande traitée avec succès pour l'article : {} en {} ms", item.getId(), (endTime - startTime));

    } catch (Exception e) {
      logger.error("Erreur lors du traitement de l'article : {}", orderDTO.getItemId(), e);
      throw e;
    }
  }

  public List<OrderItemDTO> findByIdOrder(String idOrderChange) {
    // Récupérer tous les items ayant le même idOrderChange
    List<ItemsOrders> itemsOrders = caisseOrderRepo.findByIdOrderChange(idOrderChange);

    // Mapper les résultats en DTO contenant uniquement `idOrderChange`, `item_name`, et `salesPrice`
    return itemsOrders.stream()
      .map(item -> new OrderItemDTO(item.getIdOrderChange(), item.getName(), item.getSalesPrice(),item.getDateIntegration()))
      .collect(Collectors.toList());
  }


  private void updateProductStock(Item item, int cartQuantity) {
    int updatedStock = item.getQuantity() - cartQuantity;
    if (updatedStock < 0) {
      throw new IllegalStateException("Stock insuffisant après décrémentation pour l'article : " + item.getId());
    }
    item.setQuantity(updatedStock);
    productRepository.save(item); // Mettre à jour la quantité en stock
  }


  public void processWithRetry(List<OrderRequestDTO> orderDTOList, int maxRetries) {
    for (int i = 0; i < maxRetries; i++) {
      try {
        processAndSaveOrder(orderDTOList); // Tente de traiter les commandes
        return; // Succès, sortir de la boucle
      } catch (Exception e) {
        if (i == maxRetries - 1 || !(e.getCause() instanceof org.hibernate.exception.LockAcquisitionException)) {
          throw e; // Échec ou autre exception, lever l'exception
        }
        // Attendre avant de réessayer
        try {
          Thread.sleep(100);
        } catch (InterruptedException ex) {
          Thread.currentThread().interrupt();
        }
      }
    }
  }

}
