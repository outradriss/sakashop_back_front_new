package com.example.sakashop.DAO;

import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CaisseOrderRepo extends JpaRepository<Order,Long> {


  Optional<Order> findByIdOrder(String idOrder);
  @Query("SELECT io FROM ItemsOrders io WHERE io.idOrderChange = :idOrderChange")
  List<ItemsOrders> findByIdOrderChange(@Param("idOrderChange") String idOrderChange);


}
