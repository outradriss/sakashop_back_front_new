package com.example.sakashop.Entities;

import com.example.sakashop.ENUM.FactureStatut;
import com.example.sakashop.ENUM.Paiement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Factures {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "numero", nullable = false, unique = true)
  private String numero;

  @Column(name = "date_emission", nullable = false)
  private LocalDate dateEmission;

  @Column(name = "date_echeance", nullable = false)
  private LocalDate dateEcheance;

  @Column(name = "total", nullable = false)
  private double total;

  @Enumerated(EnumType.STRING)
  @Column(name = "statut", nullable = false)
  private FactureStatut statut;

  @ManyToOne
  @JoinColumn(name = "client_id", nullable = false)
  private Credit client;

  @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<DetailFactures> details;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Paiement paiement;

}
