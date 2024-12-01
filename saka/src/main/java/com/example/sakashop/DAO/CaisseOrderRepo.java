package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaisseOrderRepo extends JpaRepository<Order,Long> {
}
