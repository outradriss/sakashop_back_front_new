package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
 public interface CategoryRepo extends JpaRepository<Categories, Long> {
    @Query("SELECT c FROM Categories c")
    List<Categories> findAllCategories();

}
