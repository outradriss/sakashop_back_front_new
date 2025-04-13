package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.*;
import com.example.sakashop.DTO.OrderChangeRequestDTO;
import com.example.sakashop.DTO.OrderItemDTO;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
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
  @Autowired
  private CaisseEntityRepo caisseRepository;

  @Autowired
  JdbcTemplate jdbcTemplate;

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
      // ✅ Vérification des données d'entrée
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

      // ✅ Récupérer l'article
      Optional<Item> itemOptional = productRepository.findById(orderDTO.getItemId());
      if (itemOptional.isEmpty()) {
        logger.error("Article non trouvé : {}", orderDTO.getItemId());
        throw new IllegalArgumentException("Article non trouvé : " + orderDTO.getItemId());
      }

      Item item = itemOptional.get();

      // ✅ Vérification et mise à jour du champ 'name'
      if (item.getName() == null || item.getName().isEmpty()) {
        item.setName(orderDTO.getNameProduct());
        logger.warn("Nom de l'article mis à jour depuis le DTO : {}", orderDTO.getNameProduct());
      }

      // ✅ Vérification du stock disponible
      if (item.getQuantity() < orderDTO.getQuantity()) {
        logger.warn("Stock insuffisant pour l'article : {}", item.getId());
        throw new IllegalStateException("Stock insuffisant pour l'article : " + item.getId());
      }

      // ✅ Mise à jour du stock
      int updatedStock = item.getQuantity() - orderDTO.getQuantity();
      item.setQuantity(updatedStock);

      // ✅ Sauvegarder l'article avec versionning
      productRepository.save(item);
      logger.info("Stock mis à jour avec succès pour l'article : {}. Stock actuel : {}", item.getId(), item.getQuantity());

      // ✅ Création de la commande
      Order order = new Order();
      order.setDateOrder(orderDTO.getDateOrder());
      order.setLastUpdated(orderDTO.getLastUpdated());
      order.setTotalePrice(orderDTO.getTotalePrice());
      order.setIdOrderChange(orderDTO.getIdOrderChange());
      order.setComment(orderDTO.getComment());
      Caisse caisse = caisseRepository.findById(orderDTO.getCaisseId())
        .orElseThrow(() -> new EntityNotFoundException("Caisse non trouvée avec l'id: " + orderDTO.getCaisseId()));
      order.setCaisse(caisse);



      // ✅ Associer les articles à la commande
      ItemsOrders itemsOrders = new ItemsOrders();
      itemsOrders.setOrder(order);
      itemsOrders.setItem(item);
      itemsOrders.setCartQuantity(orderDTO.getQuantity());
      itemsOrders.setStockQuantity(item.getQuantity());
      itemsOrders.setCashAmount(orderDTO.getCashAmount());
      itemsOrders.setChequeAmount(orderDTO.getChequeAmount());
      itemsOrders.setCardAmount(orderDTO.getCardAmount());


      // ✅ Gestion de negoPrice et salesPrice
      double finalSalesPrice = (orderDTO.getNegoPrice() == -1) ? 0.0 : orderDTO.getSalesPrice();
      itemsOrders.setSalesPrice(finalSalesPrice); // ✅ Applique la règle

      itemsOrders.setPromoPrice(orderDTO.getPricePromo());
      itemsOrders.setNegoPrice(orderDTO.getNegoPrice());
      itemsOrders.setDateIntegration(LocalDateTime.now());
      itemsOrders.setName(item.getName());
      itemsOrders.setIdOrderChange(orderDTO.getIdOrderChange());
      itemsOrders.setTypePaiement(orderDTO.getTypePaiement());
      itemsOrders.setTotalePrice(orderDTO.getTotalePrice());

      order.setItemsOrders(List.of(itemsOrders));

      // ✅ Sauvegarde de la commande
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


  public void updateProductStock(Item item, int cartQuantity) {
    int updatedStock = item.getQuantity() - cartQuantity;
    if (updatedStock < 0) {
      throw new IllegalStateException("Stock insuffisant après décrémentation pour l'article : " + item.getId());
    }
    item.setQuantity(updatedStock);
    productRepository.save(item); // Mettre à jour la quantité en stock
  }



  public String updateOrderChange(OrderChangeRequestDTO orderChangeRequest) {
    // ✅ 1. Vérifier si la commande existe
    String sqlCheck = "SELECT COUNT(*) FROM items_orders WHERE id_order_change = ?";
    Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, orderChangeRequest.getIdOrderChange());

    if (count == null || count == 0) {
      return "❌ Erreur : La commande avec ID " + orderChangeRequest.getIdOrderChange() + " est introuvable.";
    }

    // ✅ 2. Récupérer `item_id` correspondant à `oldItemCode`
    String sqlFindItemId = "SELECT id FROM items WHERE item_code = ?";
    Long oldItemId;
    try {
      oldItemId = jdbcTemplate.queryForObject(sqlFindItemId, Long.class, orderChangeRequest.getOldItemCode());
    } catch (EmptyResultDataAccessException e) {
      return "❌ Erreur : L'ancien produit avec le code " + orderChangeRequest.getOldItemCode() + " n'existe pas.";
    }

    // ✅ 3. Vérifier si `oldItemId` existe dans `items_orders`
    String sqlFindItemOrder = "SELECT id, cart_quantity FROM items_orders WHERE id_order_change = ? AND item_id = ?";
    Map<String, Object> itemOrderData;
    try {
      itemOrderData = jdbcTemplate.queryForMap(sqlFindItemOrder, orderChangeRequest.getIdOrderChange(), oldItemId);
    } catch (EmptyResultDataAccessException e) {
      return "❌ Erreur : L'ancien produit n'existe pas dans cette commande.";
    }

    Long itemOrderId = (Long) itemOrderData.get("id");
    Integer oldQuantity = (Integer) itemOrderData.get("cart_quantity");

    // ✅ 4. Récupérer les détails du nouveau produit
    String sqlNewProduct = "SELECT id, item_name, sales_price FROM items WHERE item_code = ?";
    Map<String, Object> newProduct;
    try {
      newProduct = jdbcTemplate.queryForMap(sqlNewProduct, orderChangeRequest.getNewItemCode());
    } catch (EmptyResultDataAccessException e) {
      return "❌ Erreur : Le nouveau produit avec le code " + orderChangeRequest.getNewItemCode() + " n'existe pas.";
    }

    Long newItemId = (Long) newProduct.get("id");
    String newNameProduct = (String) newProduct.get("item_name");
    Double newSalesPrice = (Double) newProduct.get("sales_price");

    // ✅ 5. Vérifier et ajuster la quantité de `oldItemId`
    if (oldQuantity > 1) {
      String sqlUpdateOldQuantity = "UPDATE items_orders SET cart_quantity = cart_quantity - 1 WHERE id = ?";
      jdbcTemplate.update(sqlUpdateOldQuantity, itemOrderId);
    } else {
      String sqlDeleteOldItem = "DELETE FROM items_orders WHERE id = ?";
      jdbcTemplate.update(sqlDeleteOldItem, itemOrderId);
    }

    // ✅ 6. Ajouter `newItemId` en tant que nouveau produit
    String sqlInsertNewItem = "INSERT INTO items_orders (order_id, item_id, name, cart_quantity, sales_price, date_integration, id_order_change) " +
      "VALUES (?, ?, ?, 1, ?, NOW(), ?)";
    jdbcTemplate.update(sqlInsertNewItem, orderChangeRequest.getIdOrderChange(), newItemId, newNameProduct, newSalesPrice, orderChangeRequest.getIdOrderChange());

    // ✅ 7. Mettre à jour les stocks dans `items`
    String sqlIncreaseOldStock = "UPDATE items SET quantity = quantity + 1 WHERE id = ?";
    jdbcTemplate.update(sqlIncreaseOldStock, oldItemId);

    String sqlDecreaseNewStock = "UPDATE items SET quantity = quantity - 1 WHERE id = ?";
    jdbcTemplate.update(sqlDecreaseNewStock, newItemId);

    // ✅ 8. Recalculer le total après modification
    String sqlTotalBefore = "SELECT SUM(sales_price * cart_quantity) FROM items_orders WHERE id_order_change = ?";
    Double oldTotal;
    try {
      oldTotal = jdbcTemplate.queryForObject(sqlTotalBefore, Double.class, orderChangeRequest.getIdOrderChange());
    } catch (EmptyResultDataAccessException e) {
      return "❌ Erreur : Impossible de récupérer l'ancien total de la commande.";
    }

    String sqlTotalAfter = "SELECT SUM(sales_price * cart_quantity) FROM items_orders WHERE id_order_change = ?";
    Double newTotal;
    try {
      newTotal = jdbcTemplate.queryForObject(sqlTotalAfter, Double.class, orderChangeRequest.getIdOrderChange());
    } catch (EmptyResultDataAccessException e) {
      return "❌ Erreur : Impossible de recalculer le total de la commande après modification.";
    }

    // ✅ 9. Insérer dans `diffItemsPrice` uniquement si la différence est positive
    if (newTotal > oldTotal) {
      Long diffPayClient = Math.round(newTotal - oldTotal);
      String sqlInsertDiff = "INSERT INTO diffItemsPrice (id_order_change, diffPayClient, date_created) VALUES (?, ?, NOW())";
      jdbcTemplate.update(sqlInsertDiff, orderChangeRequest.getIdOrderChange(), diffPayClient);
    }

    // ✅ 10. Mettre à jour `orders`
    String sqlUpdateTotal = "UPDATE orders SET totale_price = ?, last_updated = NOW() WHERE id_order_change = ?";
    jdbcTemplate.update(sqlUpdateTotal, newTotal, orderChangeRequest.getIdOrderChange());

    return "✅ Commande mise à jour avec succès.";
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
