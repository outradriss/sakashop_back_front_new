package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ProductRepository extends JpaRepository<Item, Long> {
  @Query("SELECT MAX(i.lastUpdated) FROM Item i")
  LocalDateTime findLastUpdateTimestamp();

}
