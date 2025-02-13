package com.example.sakashop.Entities;

import com.example.sakashop.ENUM.StatutLivraison;
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
public class BonDeLivraison {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "facture_id", nullable = false)
  private Factures facture;

  @Column(nullable = false)
  private LocalDate dateLivraison;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private StatutLivraison statut;

  @OneToMany(mappedBy = "bonDeLivraison", cascade = CascadeType.ALL) // ✅ Correction ici
  private List<DetailFactures> details;
}
