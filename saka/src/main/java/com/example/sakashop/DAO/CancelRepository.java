package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Cancel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CancelRepository extends JpaRepository<Cancel, Long> {

  @Query("SELECT c FROM Cancel c JOIN FETCH c.item WHERE c.item.id = :itemId")
  List<Cancel> findByItemId(@Param("itemId") Long itemId);
}
