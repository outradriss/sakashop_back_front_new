package com.example.sakashop.controllers;

import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/caisse")
@CrossOrigin(origins = "*")
public class CaisseController {

   @Autowired
   CaisseServiceImpl caisseService;

  @GetMapping("/list")
  public List<Item> getAllProducts() {
    return caisseService.getAllProducts();
  }

}
