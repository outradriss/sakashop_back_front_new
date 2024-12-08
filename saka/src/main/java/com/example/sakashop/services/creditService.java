package com.example.sakashop.services;

import com.example.sakashop.Entities.Item;
import org.springframework.stereotype.Service;

import java.util.List;


public interface creditService {

  List<Item> getAll();

}
