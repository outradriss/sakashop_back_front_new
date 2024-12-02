package com.example.sakashop.DAO;


import com.example.sakashop.Entities.ItemsOrders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemsOrdersREpo extends JpaRepository<ItemsOrders,Long> {
}


