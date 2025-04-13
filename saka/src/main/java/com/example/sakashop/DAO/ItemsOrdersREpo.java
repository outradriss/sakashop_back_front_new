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


  @Query("SELECT io FROM ItemsOrders io " +
    "JOIN FETCH io.item i " +
    "JOIN FETCH io.order o " +
    "LEFT JOIN FETCH o.caisse c") // ✅ ici le changement
  List<ItemsOrders> findAllWithItems();


  @Query("SELECT io FROM ItemsOrders io JOIN FETCH io.item WHERE DATE(io.dateIntegration) = CURRENT_DATE")
  List<ItemsOrders> findAllWithItemsForToday();

}


