package com.example.sakashop.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "passwordcaisse")
public class PasswordLockCaisse {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id_caisse;
  @Column(nullable = false, unique = true)
  private String password;
}
