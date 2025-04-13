package com.example.sakashop.DTO;


import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BonLivraisonDTO {
  private Long id;
  private String reference;
  private String clientName;
  private String clientICE;
  private String adresse;
  private LocalDate dateLivraison;
  private Double totalHT;
  private Double totalTVA;
  private Double totalTTC;
  private List<BonLivraisonItemDTO> itemQuantities;
}
