package com.example.sakashop.DAO;

import com.example.sakashop.Entities.PasswordLockCaisse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordLockCaisseRepo extends JpaRepository<PasswordLockCaisse,Long> {

  @Query("SELECT p FROM PasswordLockCaisse p WHERE LOWER(p.password) = LOWER(:password)")
  PasswordLockCaisse findByPassword(@Param("password") String password);}
