package com.example.sakashop.services;

import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.User;

import java.util.List;

public interface userService {

    User save(UserDTO user);

    List<User> findAll();


    User findOne(String username);

    User createEmployee(UserDTO user);

}