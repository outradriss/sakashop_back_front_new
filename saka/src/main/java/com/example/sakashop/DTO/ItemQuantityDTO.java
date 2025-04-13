package com.example.sakashop.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemQuantityDTO {
  private Long id;

  private String name;

  @JsonProperty("quantity")
  private int quantite;

  private double prixHT;
  private double tva;
  private double prixTTC;
  private double totalTTC;


}
