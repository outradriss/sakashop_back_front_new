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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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
        // Vérifie si le produit existe dans la table `Item`
        Item item = productRepository.findById(productId)
          .orElseThrow(() -> new EntityNotFoundException("Produit introuvable avec l'ID : " + productId));

        // Vérifie si le code de l'item est valide
        if (item.getItemCode() == null || item.getItemCode().trim().isEmpty()) {
          throw new IllegalStateException("Le produit avec l'ID " + productId + " n'a pas de code valide.");
        }

        // Récupère les données historiques de la table `ItemsOrders`
        List<ItemsOrders> itemsOrders = itemsOrdersRepository.findByItem(item);

        // Vérifie si `itemsOrders` est vide
        if (itemsOrders == null || itemsOrders.isEmpty()) {
          return List.of(new ProductHistoryDTO(
            item.getName(),
            item.getItemCode(),
            item.getProductAddedDate(),
            item.getQuantity(),
            item.getPricePromo(),
            item.getBuyPrice(),
            0, // Quantité ajoutée par défaut
            item.getSalesPrice(), // Prix de vente par défaut
            item.getProductAddedDate(), // Date par défaut
            null, // ID commande
            0.0, // Total commande par défaut
            null, // Date commande par défaut
            0.0, // Prix négocié par défaut
            null // Date de mise à jour par défaut
          ));
        }

        // Transformation des données en `ProductHistoryDTO`
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
        // Gérer le cas où le produit est introuvable
        throw ex; // Laisser remonter pour être géré par le contrôleur ou @ControllerAdvice
      } catch (Exception ex) {
        // Gérer toute autre exception imprévue
        throw new RuntimeException("Erreur lors de la récupération de l'historique du produit", ex);
      }
    }

    public List<OrderRequestDTO> getAllProductHistory() {
      // Récupérer toutes les données de ItemsOrders avec Items inclus
      List<ItemsOrders> itemsOrders = itemsOrdersRepository.findAllWithItems();

      // Regrouper les items par idOrderChange
      Map<String, List<ItemsOrders>> groupedOrders = itemsOrders.stream()
        .collect(Collectors.groupingBy(ItemsOrders::getIdOrderChange));

      // Convertir chaque groupe en une commande unique
      return groupedOrders.entrySet().stream().map(entry -> {
        String idOrderChange = entry.getKey();
        List<ItemsOrders> ordersList = entry.getValue();

        // Déterminer les valeurs communes pour la commande
        LocalDateTime dateOrder = ordersList.get(0).getDateIntegration();
        LocalDateTime lastUpdated = ordersList.get(0).getDateUpdate();
        double totalePrice = ordersList.stream().mapToDouble(ItemsOrders::getTotalePrice).sum();

        // Créer la liste des items (ItemRequestDTO)
        List<OrderRequestDTO.ItemRequestDTO> itemDTOList = ordersList.stream().map(itemsOrder -> {
          double buyPrice = (itemsOrder.getItem() != null && itemsOrder.getItem().getBuyPrice() > 0)
            ? itemsOrder.getItem().getBuyPrice()
            : 0;

          OrderRequestDTO.ItemRequestDTO itemRequestDTO = new OrderRequestDTO.ItemRequestDTO();
          itemRequestDTO.setNameProduct(itemsOrder.getName());
          itemRequestDTO.setQuantity(itemsOrder.getCartQuantity());
          itemRequestDTO.setSalesPrice(itemsOrder.getSalesPrice());
          itemRequestDTO.setTotalePrice(buyPrice * itemsOrder.getCartQuantity());
          itemRequestDTO.setItemId(itemsOrder.getItem() != null ? itemsOrder.getItem().getId() : null);
          return itemRequestDTO;
        }).collect(Collectors.toList());

        return new OrderRequestDTO.Builder(
          null, // ID de commande (optionnel si non stocké)
          null, // Nom produit (optionnel car regroupé)
          0, // Quantité totale pas utile ici
          0, // Quantité ajoutée
          false, // Promo (optionnel si pas commun)
          0.0, // Prix promo
          0.0, // Sales Price (optionnel si pas commun)
          dateOrder,
          lastUpdated,
          null, // itemId (optionnel)
          null, // itemsOrders (optionnel)
          totalePrice, // Total Price de la commande groupée
          0.0, // negoPrice (optionnel)
          0.0, // buyPrice
          itemDTOList,
          idOrderChange // 🔥 ID Order Change
        ).buildOrder();
      }).collect(Collectors.toList());
    }



  }

