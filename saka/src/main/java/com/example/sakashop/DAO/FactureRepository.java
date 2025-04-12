package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Factures;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FactureRepository extends JpaRepository<Factures, Long> {

  @EntityGraph(attributePaths = {"factureItems.item"})
  List<Factures> findAll();

  @Query("SELECT DISTINCT new map(f.clientCode as id, f.clientName as name, f.clientICE as ice, f.adresse as adresse) FROM Factures f")
  List<Map<String, Object>> findDistinctClients();
}
