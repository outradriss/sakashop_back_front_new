package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Item, Long> {
  @Query("SELECT MAX(i.lastUpdated) FROM Item i")
  LocalDateTime findLastUpdateTimestamp();

    @Query("SELECT i FROM Item i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
    Page<Item> findByNameContainingIgnoreCase(@Param("searchQuery") String searchQuery, Pageable pageable);


  @Query("SELECT i FROM Item i JOIN FETCH i.categories")
  List<Item> findAllWithCategory();

  Optional<Item> findByName(String productName);

  @Modifying
  @Query("UPDATE Item i SET i.quantity = i.quantity - :quantity WHERE i.id = :itemId AND i.quantity >= :quantity")
  int decrementItemQuantity(@Param("itemId") Long itemId, @Param("quantity") int quantity);

  @Modifying
  @Query("UPDATE Item i SET i.quantity = i.quantity + :quantity WHERE i.id = :itemId")
  int incrementItemQuantity(@Param("itemId") Long itemId, @Param("quantity") int quantity);

  @Query("SELECT io FROM ItemsOrders io JOIN FETCH io.item i WHERE io.order.id = :orderId")
  Optional<ItemsOrders> findByOrderIdWithItem(@Param("orderId") Long orderId);

  @Query(value = "SELECT * FROM items " +
    "WHERE expired_date <= CURRENT_DATE " +
    "OR expired_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 30 DAY",
    nativeQuery = true)
  List<Item> findItemsToCheck();

  @Query(value = "SELECT COUNT(*) FROM items WHERE expired_date <= CURRENT_DATE OR expired_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 30 DAY", nativeQuery = true)
  long countItemsToCheck();

}
