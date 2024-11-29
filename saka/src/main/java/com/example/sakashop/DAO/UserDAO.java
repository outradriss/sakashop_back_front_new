package com.example.sakashop.DAO;

import com.example.sakashop.Entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDAO extends CrudRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByEmail(String email);
}
