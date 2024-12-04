package com.example.sakashop.services.implServices;


import com.example.sakashop.DAO.HistoryREpo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.ProductHistoryDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

  @Service
  public class HistoryServiceImpl {

    private final ProductRepository productRepository;
    private final ItemsOrdersREpo itemsOrdersRepository;
    private final  HistoryREpo historyREpo;

    public HistoryServiceImpl(ProductRepository productRepository, ItemsOrdersREpo itemsOrdersRepository,HistoryREpo historyREpo) {
      this.productRepository = productRepository;
      this.itemsOrdersRepository = itemsOrdersRepository;
      this.historyREpo=historyREpo;
    }

    public List<ProductHistoryDTO> getProductHistory(Long productId) {
      try {
        // Vérifie si le produit existe dans la table `Item`
        Item item = productRepository.findById(productId)
          .orElseThrow(() -> new EntityNotFoundException("Produit introuvable avec l'ID : " + productId));

        // Récupère les données historiques de la table `ItemsOrders` pour cet item
        List<ItemsOrders> itemsOrders = itemsOrdersRepository.findByItem(item);

        // Transformation des données en ProductHistoryDTO
        return itemsOrders.stream()
          .map(order -> {
            Order associatedOrder = order.getOrder(); // Relation avec la commande
            return new ProductHistoryDTO(
              item.getName(),                       // Nom du produit
              item.getItemCode(),                   // ID du produit
              item.getProductAddedDate(),           // Date d'ajout du produit
              item.getQuantity(),
              item.getPricePromo(),// Quantité actuelle en stock
              order.getCartQuantity(),              // Quantité commandée pour ce produit
              order.getDateIntegration(),           // Date d'intégration
              associatedOrder.getIdOrder(),         // ID de la commande
              associatedOrder.getTotalePrice(),     // Total de la commande
              associatedOrder.getDateOrder(),       // Date de la commande
              order.getSalesPrice(),                // Prix de vente
              order.getNegoPrice(),                 // Prix négocié
              order.getDateUpdate()                 // Date de mise à jour
            );
          })
          .collect(Collectors.toList());

      } catch (EntityNotFoundException ex) {
        throw ex; // Laisser remonter pour être géré par le contrôleur ou @ControllerAdvice
      } catch (Exception ex) {
        throw new RuntimeException("Erreur lors de la récupération de l'historique du produit", ex);
      }
    }
  }

