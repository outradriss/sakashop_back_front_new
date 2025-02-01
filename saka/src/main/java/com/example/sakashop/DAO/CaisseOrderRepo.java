package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaisseOrderRepo extends JpaRepository<Order,Long> {


  Optional<Order> findByIdOrder(String idOrder);
  Optional<Order> findByIdOrderChange(String idOrderChange);

}
