package com.example.sakashop.DAO;

import com.example.sakashop.Entities.FactureItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactureItemREpo extends JpaRepository<FactureItem ,Long > {
}
