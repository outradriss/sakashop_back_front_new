package com.example.sakashop.DTO;


import lombok.Data;

@Data
public class BonLivraisonItemDTO {
  private Long id;
  private Long productId;
  private String productName;
  private Double prixHT;
  private Double tva;
  private Double prixTTC;
  private Integer quantity;
  private Double totalTTC;
}
