package com.example.sakashop.services.implServices;
import com.example.sakashop.DAO.BonLivraisonRepository;
import com.example.sakashop.DTO.BonLivraisonDTO;
import com.example.sakashop.DTO.BonLivraisonMapper;
import com.example.sakashop.Entities.BonLivraison;
import com.example.sakashop.Entities.BonLivraisonItem;
import com.example.sakashop.Entities.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BonLivraisonService {

  @Autowired
  private BonLivraisonRepository bonLivraisonRepository;

  @Autowired
  private BonLivraisonMapper bonLivraisonMapper;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional
    public BonLivraisonDTO saveBonLivraison(BonLivraisonDTO dto) {
      BonLivraison entity = bonLivraisonMapper.toEntity(dto);

      entity.getItems().forEach(item -> {
        item.setBonLivraison(entity);

        if (item.getItem() != null && item.getItem().getId() != null) {
          Item existingItem = entityManager.find(Item.class, item.getItem().getId());

          if (existingItem != null) {
            int nouveauStock = existingItem.getQuantity() - item.getQuantity();

            if (nouveauStock < 0) {
              throw new IllegalStateException("Stock insuffisant pour le produit : " + existingItem.getName());
            }

            existingItem.setQuantity(nouveauStock);
            item.setItem(existingItem);
          } else {
            throw new IllegalStateException("Produit introuvable avec l'ID : " + item.getItem().getId());
          }

        } else {
          throw new IllegalStateException("ID produit manquant ou invalide pour BonLivraisonItem.");
        }
      });

      BonLivraison saved = bonLivraisonRepository.save(entity);
      return bonLivraisonMapper.toDto(saved);
    }

  public List<BonLivraisonDTO> getAllBonLivraison() {
    return bonLivraisonRepository.findAll()
      .stream()
      .map(bonLivraisonMapper::toDto)
      .collect(Collectors.toList());
  }

  public BonLivraisonDTO getBonLivraisonById(Long id) {
    Optional<BonLivraison> bl = bonLivraisonRepository.findById(id);
    return bl.map(bonLivraisonMapper::toDto).orElse(null);
  }

  public BonLivraisonDTO updateBonLivraison(Long id, BonLivraisonDTO dto) {
    BonLivraison updated = bonLivraisonMapper.toEntity(dto);
    updated.setId(id);
    updated.getItems().forEach(item -> {
      item.setBonLivraison(updated);
      if (item.getItem() != null && item.getItem().getId() != null) {
        item.setItem(entityManager.getReference(item.getItem().getClass(), item.getItem().getId()));
      } else {
        throw new IllegalStateException("Item ID manquant ou invalide pour BonLivraisonItem.");
      }
    });
    return bonLivraisonMapper.toDto(bonLivraisonRepository.save(updated));
  }


  @Transactional
  public void deleteBonLivraison(Long id) {
    BonLivraison bl = bonLivraisonRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Bon de Livraison introuvable avec l'ID : " + id));


    for (BonLivraisonItem item : bl.getItems()) {
      Item produit = item.getItem();
      if (produit != null) {
        int stockActuel = produit.getQuantity();
        produit.setQuantity(stockActuel + item.getQuantity());
      }
    }
    bonLivraisonRepository.delete(bl);
  }

}
