package com.example.sakashop.services.implServices;
import com.example.sakashop.DAO.BonLivraisonRepository;
import com.example.sakashop.DTO.BonLivraisonDTO;
import com.example.sakashop.DTO.BonLivraisonMapper;
import com.example.sakashop.Entities.BonLivraison;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

  public BonLivraisonDTO saveBonLivraison(BonLivraisonDTO dto) {
    BonLivraison entity = bonLivraisonMapper.toEntity(dto);
    entity.getItems().forEach(item -> {
      item.setBonLivraison(entity);
      if (item.getItem() != null && item.getItem().getId() != null) {
        item.setItem(entityManager.getReference(item.getItem().getClass(), item.getItem().getId()));
      } else {
        throw new IllegalStateException("Item ID manquant ou invalide pour BonLivraisonItem.");
      }
    });
    return bonLivraisonMapper.toDto(bonLivraisonRepository.save(entity));
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

  public void deleteBonLivraison(Long id) {
    bonLivraisonRepository.deleteById(id);
  }
}
