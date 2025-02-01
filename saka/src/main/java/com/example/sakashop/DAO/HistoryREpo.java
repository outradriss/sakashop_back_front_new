package com.example.sakashop.DAO;

import com.example.sakashop.Entities.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface HistoryREpo extends JpaRepository<History,Long> {

}
