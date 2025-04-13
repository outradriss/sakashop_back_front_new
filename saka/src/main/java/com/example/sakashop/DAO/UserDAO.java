package com.example.sakashop.DAO;

import com.example.sakashop.Entities.Caisse;
import com.example.sakashop.Entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDAO extends CrudRepository<User, Long> {
    User findByUsername(String username);

  User findByEmail(String email);

  boolean existsByEmail(String email);

  Optional<User> findByCaisse(Caisse caisse);

}
