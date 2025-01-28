package com.example.sakashop.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "addcaisse")
public class Caisse {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nom;

  @Column(nullable = false)
  private String pays;

  @Column(nullable = false)
  private String ville;

  @Column(nullable = false)
  private String utilisateur;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String role;
}
