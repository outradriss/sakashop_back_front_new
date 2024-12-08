package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditRepo extends JpaRepository<Credit,Long> {

  @Query("SELECT i FROM Item i JOIN FETCH i.categories")
  List<Item> findAllForCreditWithCategoryForCaisse();


}
