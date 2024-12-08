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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaisseServiceImpl implements caisseService {

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
      // Calcul du prix total de la commande
      double totaleCommande = orders.stream()
        .mapToDouble(orderDTO -> {
          // Calculer le prix total basé sur les règles de priorité
          double priceToUse = orderDTO.getNegoPrice() > 0
            ? orderDTO.getNegoPrice()
            : (orderDTO.getIsPromo() ? orderDTO.getPricePromo() : orderDTO.getSalesPrice());
          return priceToUse * orderDTO.getQuantity();
        })
        .sum();

      // Création et sauvegarde de la commande principale
      Order order = new Order();
      order.setDateOrder(orders.get(0).getDateOrder());
      order.setLastUpdated(orders.get(0).getLastUpdated());
      order.setTotalePrice(totaleCommande);
      Order savedOrder = caisseOrderRepo.save(order);

      // Préparation des entités ItemsOrders
      List<ItemsOrders> itemsOrdersToSave = orders.stream().map(orderDTO -> {
        // Recherche de l'item
        Item item = productRepository.findById(orderDTO.getItemId())
          .orElseThrow(() -> new EntityNotFoundException("Item introuvable avec l'ID : " + orderDTO.getItemId()));

        // Création de l'entité ItemsOrders
        ItemsOrders itemsOrders = new ItemsOrders();
        itemsOrders.setOrder(savedOrder); // Associer à la commande unique
        itemsOrders.setItem(item); // Associer l'item
        itemsOrders.setName(item.getName());
        itemsOrders.setDateIntegration(orderDTO.getDateOrder());
        itemsOrders.setDateUpdate(orderDTO.getLastUpdated());
        itemsOrders.setStockQuantity(item.getQuantity());
        itemsOrders.setCartQuantity(orderDTO.getQuantity());
        itemsOrders.setSalesPrice(orderDTO.getSalesPrice());
        itemsOrders.setNegoPrice(orderDTO.getNegoPrice());
        itemsOrders.setPromoPrice(orderDTO.getPricePromo());

        // Mise à jour du stock
        updateProductStock(item, orderDTO.getQuantity());

        return itemsOrders;
      }).collect(Collectors.toList());

      // Sauvegarde de tous les items associés à la commande
      itemsOrdersREpo.saveAll(itemsOrdersToSave);

    } catch (EntityNotFoundException e) {
      throw new RuntimeException("Erreur lors de la recherche d'un item : " + e.getMessage(), e);
    } catch (Exception e) {
      throw new RuntimeException("Erreur critique lors de l'enregistrement des commandes.", e);
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

