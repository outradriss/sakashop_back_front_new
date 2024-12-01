package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CaisseRepo extends JpaRepository<Item,Long> {


  @Query("SELECT MAX(i.lastUpdated) FROM Item i")
  LocalDateTime findLastUpdateTimestamp();

  @Query("SELECT i FROM Item i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
  Page<Item> findByNameContainingIgnoreCase(@Param("searchQuery") String searchQuery, Pageable pageable);


  @Query("SELECT i FROM Item i JOIN FETCH i.categories")
  List<Item> findAllWithCategoryForCaisse();

}
