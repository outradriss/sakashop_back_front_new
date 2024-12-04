package com.example.sakashop.services;

import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface userService {

    User save(UserDTO user);

    ResponseEntity<List<User>> findAll();


    User findOne(String username);

    ResponseEntity<User> createEmployee(UserDTO user);

}
