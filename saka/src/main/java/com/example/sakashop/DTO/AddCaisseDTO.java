package com.example.sakashop.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddCaisseDTO {
  private String nom;
  private String pays;
  private String ville;
  private String utilisateur;
  private String password;
  private String role;
}
