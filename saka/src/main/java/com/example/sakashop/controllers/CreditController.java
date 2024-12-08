package com.example.sakashop.controllers;


import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.implServices.CreditServicImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/credit-client")
@CrossOrigin(origins = "*")
public class CreditController {

  @Autowired
  CreditServicImpl creditService;


  @GetMapping("/all")
  public List<Item> getAllProductCredit (){

   return creditService.getAll();

  }

}
