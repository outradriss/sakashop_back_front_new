package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Caisse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddCaisseRepo extends JpaRepository <Caisse,Long> {

  boolean existsByNom(String nom);
}
