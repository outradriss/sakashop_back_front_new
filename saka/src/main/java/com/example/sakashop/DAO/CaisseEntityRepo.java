package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Caisse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaisseEntityRepo extends JpaRepository<Caisse, Long> {
  Optional<Caisse> findByUtilisateur(String utilisateur);
}
