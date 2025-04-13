package com.example.sakashop.DTO;

import lombok.Data;

@Data
public class ProduitFactureDTO {
  private Long id;
  private String name;
  private Double prixHT;
  private Double prixTTC;
  private Double tva;
  private Integer quantity;
}
