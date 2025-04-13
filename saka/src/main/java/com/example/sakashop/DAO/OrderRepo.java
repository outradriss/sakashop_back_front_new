package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Caisse;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order,Long> {

  List<Order> findByCaisse(Caisse caisse);

}
