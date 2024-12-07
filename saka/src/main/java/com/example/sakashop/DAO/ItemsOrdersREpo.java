package com.example.sakashop.DAO;


import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsOrdersREpo extends JpaRepository<ItemsOrders,Long> {
  List<ItemsOrders> findByItem(Item item);


  @Query("SELECT io FROM ItemsOrders io JOIN FETCH io.item")
  List<ItemsOrders> findAllWithItems();
}


