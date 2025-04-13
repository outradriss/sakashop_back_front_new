package com.example.sakashop.services.implServices;


import com.example.sakashop.DAO.HistoryREpo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.DTO.ProductHistoryDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HistoryServiceImpl {

  private final ProductRepository productRepository;
  private final ItemsOrdersREpo itemsOrdersRepository;
  private final HistoryREpo historyREpo;

  public HistoryServiceImpl(ProductRepository productRepository, ItemsOrdersREpo itemsOrdersRepository, HistoryREpo historyREpo) {
    this.productRepository = productRepository;
    this.itemsOrdersRepository = itemsOrdersRepository;
    this.historyREpo = historyREpo;
  }

  public List<ProductHistoryDTO> getProductHistory(Long productId) {
    try {
      Item item = productRepository.findById(productId)
        .orElseThrow(() -> new EntityNotFoundException("Produit introuvable avec l'ID : " + productId));

      if (item.getItemCode() == null || item.getItemCode().trim().isEmpty()) {
        throw new IllegalStateException("Le produit avec l'ID " + productId + " n'a pas de code valide.");
      }

      List<ItemsOrders> itemsOrders = itemsOrdersRepository.findByItem(item);

      if (itemsOrders == null || itemsOrders.isEmpty()) {
        return List.of(new ProductHistoryDTO(
          item.getName(),
          item.getItemCode(),
          item.getProductAddedDate(),
          item.getQuantity(),
          item.getPricePromo(),
          item.getBuyPrice(),
          0,
          item.getSalesPrice(),
          item.getProductAddedDate(),
          null,
          0.0,
          null,
          0.0,
          null
        ));
      }

      return itemsOrders.stream()
        .map(order -> {
          Order associatedOrder = order.getOrder();
          return new ProductHistoryDTO(
            item.getName(),
            item.getItemCode(),
            item.getProductAddedDate(),
            item.getQuantity(),
            item.getPricePromo(),
            item.getBuyPrice(),
            order.getCartQuantity(),
            order.getSalesPrice(),
            order.getDateIntegration() != null ? order.getDateIntegration() : item.getProductAddedDate(),
            associatedOrder != null ? associatedOrder.getIdOrder() : null,
            associatedOrder != null ? associatedOrder.getTotalePrice() : 0.0,
            associatedOrder != null ? associatedOrder.getDateOrder() : null,
            order.getNegoPrice(),
            order.getDateUpdate() != null ? order.getDateUpdate() : null
          );
        })
        .collect(Collectors.toList());

    } catch (EntityNotFoundException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new RuntimeException("Erreur lors de la récupération de l'historique du produit", ex);
    }
  }

  public List<OrderRequestDTO> getAllProductHistory() {
    List<ItemsOrders> itemsOrders = itemsOrdersRepository.findAllWithItems();

    if (itemsOrders.isEmpty()) {
      return Collections.emptyList();
    }

    Map<String, List<ItemsOrders>> groupedOrders = itemsOrders.stream()
      .collect(Collectors.groupingBy(ItemsOrders::getIdOrderChange));

    return groupedOrders.entrySet().stream().map(entry -> {
      String idOrderChange = entry.getKey();
      List<ItemsOrders> ordersList = entry.getValue();

      String typePaiement = ordersList.stream()
        .map(ItemsOrders::getTypePaiement)
        .filter(Objects::nonNull)
        .findFirst()
        .orElse("Inconnu");

      LocalDateTime dateOrder = ordersList.get(0).getDateIntegration();
      LocalDateTime lastUpdated = ordersList.get(0).getDateUpdate();

      double totalePrice = ordersList.stream()
        .mapToDouble(itemsOrder -> itemsOrder.getTotalePrice() > 0 ? itemsOrder.getTotalePrice() :
          (itemsOrder.getNegoPrice() > 0 ? itemsOrder.getNegoPrice() * itemsOrder.getCartQuantity() :
            itemsOrder.getSalesPrice() * itemsOrder.getCartQuantity()))
        .sum();

      List<OrderRequestDTO.ItemRequestDTO> itemDTOList = ordersList.stream().map(itemsOrder -> {
        Item item = itemsOrder.getItem();

        double negoPrice = itemsOrder.getNegoPrice() > 0 ? itemsOrder.getNegoPrice() : 0.0;
        double salesPrice = itemsOrder.getSalesPrice() > 0 ? itemsOrder.getSalesPrice() : 0.0;

        OrderRequestDTO.ItemRequestDTO itemRequestDTO = new OrderRequestDTO.ItemRequestDTO();
        itemRequestDTO.setNameProduct(itemsOrder.getName());
        itemRequestDTO.setQuantity(itemsOrder.getCartQuantity() > 0 ? itemsOrder.getCartQuantity() : 1);
        itemRequestDTO.setSalesPrice(salesPrice);
        itemRequestDTO.setTotalePrice(salesPrice * itemsOrder.getCartQuantity());
        itemRequestDTO.setNegoPrice(negoPrice);
        itemRequestDTO.setItemId(item != null ? item.getId() : null);
        itemRequestDTO.setCode(item.getCode() != null ? item.getCode() : "NC");

        return itemRequestDTO;
      }).collect(Collectors.toList());

      return new OrderRequestDTO.Builder(
        null,
        null,
        1L,
        ordersList.stream().mapToInt(ItemsOrders::getCartQuantity).sum(),
        0,
        false,
        0.0,
        ordersList.stream().mapToDouble(ItemsOrders::getSalesPrice).sum(),
        dateOrder,
        lastUpdated,
        null,
        null,
        totalePrice,
        ordersList.stream().mapToDouble(ItemsOrders::getNegoPrice).sum(),
        ordersList.stream().mapToDouble(io -> io.getItem() != null ? io.getItem().getBuyPrice() : 0.0).sum(),
        itemDTOList,
        idOrderChange,
        typePaiement
      ).buildOrder();
    }).collect(Collectors.toList());
  }

  public List<OrderRequestDTO> getAllProductHistoryToday(Long caisseId) {
    List<ItemsOrders> itemsOrders = itemsOrdersRepository.findAllWithItemsForToday()
      .stream().filter(io -> io.getOrder() != null && io.getOrder().getCaisse() != null && io.getOrder().getCaisse().getId().equals(caisseId))
      .collect(Collectors.toList());

    Map<String, List<ItemsOrders>> groupedOrders = itemsOrders.stream()
      .collect(Collectors.groupingBy(ItemsOrders::getIdOrderChange));

    return groupedOrders.entrySet().stream().map(entry -> {
      String idOrderChange = entry.getKey();
      List<ItemsOrders> ordersList = entry.getValue();

      String typePaiement = ordersList.stream()
        .map(ItemsOrders::getTypePaiement)
        .filter(Objects::nonNull)
        .findFirst()
        .orElse("Inconnu");

      LocalDateTime dateOrder = ordersList.get(0).getDateIntegration();
      LocalDateTime lastUpdated = ordersList.get(0).getDateUpdate();

      double totalePrice = ordersList.stream()
        .mapToDouble(itemsOrder ->
          itemsOrder.getNegoPrice() > 0 ?
            itemsOrder.getNegoPrice() * itemsOrder.getCartQuantity() :
            itemsOrder.getSalesPrice() * itemsOrder.getCartQuantity()
        )
        .sum();

      List<OrderRequestDTO.ItemRequestDTO> itemDTOList = ordersList.stream().map(itemsOrder -> {
        double buyPrice = (itemsOrder.getItem() != null && itemsOrder.getItem().getBuyPrice() > 0)
          ? itemsOrder.getItem().getBuyPrice()
          : 0.0;

        double negoPrice = itemsOrder.getNegoPrice();
        double salesPrice = itemsOrder.getSalesPrice();
        String code = itemsOrder.getItem() != null ? itemsOrder.getItem().getCode() : "N/A";

        OrderRequestDTO.ItemRequestDTO itemRequestDTO = new OrderRequestDTO.ItemRequestDTO();
        itemRequestDTO.setNameProduct(itemsOrder.getName());
        itemRequestDTO.setQuantity(itemsOrder.getCartQuantity());
        itemRequestDTO.setSalesPrice(salesPrice);
        itemRequestDTO.setTotalePrice(buyPrice * itemsOrder.getCartQuantity());
        itemRequestDTO.setItemId(itemsOrder.getItem() != null ? itemsOrder.getItem().getId() : null);
        itemRequestDTO.setItemCode(itemsOrder.getItem() != null ? itemsOrder.getItem().getItemCode() : "N/A");
        itemRequestDTO.setNegoPrice(negoPrice);
        itemRequestDTO.setCode(code);

        return itemRequestDTO;
      }).collect(Collectors.toList());

      return new OrderRequestDTO.Builder(
        null,
        null,
        caisseId,
        ordersList.stream().mapToInt(ItemsOrders::getCartQuantity).sum(),
        0,
        false,
        0.0,
        ordersList.stream().mapToDouble(ItemsOrders::getSalesPrice).sum(),
        dateOrder,
        lastUpdated,
        null,
        null,
        totalePrice,
        ordersList.stream().mapToDouble(ItemsOrders::getNegoPrice).sum(),
        ordersList.stream().mapToDouble(io -> io.getItem() != null ? io.getItem().getBuyPrice() : 0.0).sum(),
        itemDTOList,
        idOrderChange,
        typePaiement
      ).buildOrder();
    }).collect(Collectors.toList());
  }
}
