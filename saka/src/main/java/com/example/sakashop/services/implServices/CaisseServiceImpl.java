package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseOrderRepo;
import com.example.sakashop.DAO.CaisseRepo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.services.caisseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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

  @Transactional
  public void saveOrders(List<OrderRequestDTO> orders) {
    List<Order> ordersToSave = new ArrayList<>();
    List<ItemsOrders> itemsOrdersToSave = new ArrayList<>();

    orders.forEach(orderDTO -> {
      // Recherche de l'Item
      Item item = productRepository.findById(orderDTO.getItemId())
        .orElseThrow(() -> new IllegalArgumentException("Item introuvable avec l'ID : " + orderDTO.getItemId()));

      // Création de la commande
      Order order = new Order();
      order.setDateOrder(orderDTO.getDateOrder());
      order.setLastUpdated(orderDTO.getLastUpdated());
      ordersToSave.add(order);

      // Création de l'entité ItemsOrders
      ItemsOrders itemsOrders = new ItemsOrders();
      itemsOrders.setOrder(order);
      itemsOrders.setItem(item);
      itemsOrders.setName(item.getName());
      itemsOrders.setDateIntegration(orderDTO.getDateOrder());
      itemsOrders.setDateUpdate(orderDTO.getLastUpdated());
      itemsOrders.setStockQuantity(item.getQuantity());
      itemsOrders.setCartQuantity(orderDTO.getQuantity());
      itemsOrdersToSave.add(itemsOrders);

      // Mise à jour du stock
      updateProductStock(item, orderDTO.getQuantity());
    });

    caisseOrderRepo.saveAll(ordersToSave);
    itemsOrdersREpo.saveAll(itemsOrdersToSave);
  }


  private void updateProductStock(Item item, int quantityOrdered) {
    int updatedStock = item.getQuantity() - quantityOrdered;
    if (updatedStock < 0) {
      throw new IllegalArgumentException("Stock insuffisant pour l'item : " + item.getName());
    }
    item.setQuantity(updatedStock);
    productRepository.save(item); // Mise à jour de la quantité en stock
  }


}

