package com.example.sakashop.DTO;

import com.example.sakashop.Entities.BonLivraison;
import com.example.sakashop.Entities.BonLivraisonItem;
import com.example.sakashop.Entities.Item;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BonLivraisonMapper {

  public BonLivraisonDTO toDto(BonLivraison entity) {
    BonLivraisonDTO dto = new BonLivraisonDTO();
    dto.setId(entity.getId());
    dto.setReference(entity.getReference());
    dto.setClientName(entity.getClientName());
    dto.setClientICE(entity.getClientICE());
    dto.setAdresse(entity.getAdresse());
    dto.setDateLivraison(entity.getDateLivraison());
    dto.setTotalHT(entity.getTotalHT());
    dto.setTotalTVA(entity.getTotalTVA());
    dto.setTotalTTC(entity.getTotalTTC());
    dto.setItemQuantities(
      entity.getItems().stream().map(this::toItemDto).collect(Collectors.toList())
    );
    return dto;
  }

  public BonLivraison toEntity(BonLivraisonDTO dto) {
    BonLivraison entity = new BonLivraison();
    entity.setId(dto.getId());
    entity.setReference(dto.getReference());
    entity.setClientName(dto.getClientName());
    entity.setClientICE(dto.getClientICE());
    entity.setAdresse(dto.getAdresse());
    entity.setDateLivraison(dto.getDateLivraison());
    entity.setTotalHT(dto.getTotalHT());
    entity.setTotalTVA(dto.getTotalTVA());
    entity.setTotalTTC(dto.getTotalTTC());
    entity.setItems(
      dto.getItemQuantities().stream().map(this::toItemEntity).collect(Collectors.toList())
    );
    return entity;
  }

  private BonLivraisonItemDTO toItemDto(BonLivraisonItem item) {
    BonLivraisonItemDTO dto = new BonLivraisonItemDTO();
    dto.setId(item.getId());
    dto.setProductId(item.getItem().getId());
    dto.setProductName(item.getItem().getName());
    dto.setPrixHT(item.getPrixHT());
    dto.setTva(item.getTva());
    dto.setPrixTTC(item.getPrixTTC());
    dto.setQuantity(item.getQuantity());
    dto.setTotalTTC(item.getTotalTTC());
    return dto;
  }

  private BonLivraisonItem toItemEntity(BonLivraisonItemDTO dto) {
    BonLivraisonItem item = new BonLivraisonItem();
    Item product = new Item();
    product.setId(dto.getProductId());
    item.setItem(product);
    item.setPrixHT(dto.getPrixHT());
    item.setTva(dto.getTva());
    item.setPrixTTC(dto.getPrixTTC());
    item.setQuantity(dto.getQuantity());
    item.setTotalTTC(dto.getTotalTTC());
    return item;
  }
}
