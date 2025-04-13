package com.example.sakashop.DAO;

import com.example.sakashop.Entities.BonLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BonLivraisonRepository extends JpaRepository<BonLivraison, Long> {
}
