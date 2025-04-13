package com.example.sakashop.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ClientFactureDTO {
  private String clientCode;
  private String clientName;
  private String clientICE;
  private String adresse;
  private List<ProduitFactureDTO> produits;
}
