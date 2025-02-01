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
import java.util.ArrayList;
import java.util.List;
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

      // Mapper chaque ItemsOrders vers un DTO OrderRequestDTO
      return itemsOrders.stream().map(itemsOrder -> {
        // Récupérer le buyPrice depuis Items
        double buyPrice = itemsOrder.getItem() != null && itemsOrder.getItem().getBuyPrice() > 0
          ? itemsOrder.getItem().getBuyPrice()
          : 0; // Si buyPrice est indisponible, définir 0 ou lever une exception personnalisée.

        // Créer la liste des items (ItemRequestDTO)
        List<OrderRequestDTO.ItemRequestDTO> itemDTOList = new ArrayList<>();
        if (itemsOrder.getItem() != null) {
          OrderRequestDTO.ItemRequestDTO itemRequestDTO = new OrderRequestDTO.ItemRequestDTO();
          itemRequestDTO.setNameProduct(itemsOrder.getName());
          itemRequestDTO.setQuantity(itemsOrder.getCartQuantity());
          itemRequestDTO.setSalesPrice(itemsOrder.getSalesPrice());
          itemRequestDTO.setTotalePrice(buyPrice * itemsOrder.getCartQuantity());
          itemRequestDTO.setItemId(itemsOrder.getItem().getId());
          itemDTOList.add(itemRequestDTO);
        }

        return new OrderRequestDTO.Builder(
          itemsOrder.getId(),
          itemsOrder.getName(),
          itemsOrder.getCartQuantity(),
          itemsOrder.getStockQuantity(),
          itemsOrder.getPromoPrice() > 0, // Promo ?
          itemsOrder.getPromoPrice(),
          itemsOrder.getSalesPrice(),
          itemsOrder.getDateIntegration(),
          itemsOrder.getDateUpdate(),
          itemsOrder.getItem() != null ? itemsOrder.getItem().getId() : null,
          itemsOrder.getId(),
          buyPrice * itemsOrder.getCartQuantity(), // Totale Price basé sur buyPrice
          itemsOrder.getNegoPrice(),
          buyPrice,
          itemDTOList,
          "CMD-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase() // Générat// Fournir la liste des items ici
        )
          .buildOrder();
      }).collect(Collectors.toList());
    }




  }

