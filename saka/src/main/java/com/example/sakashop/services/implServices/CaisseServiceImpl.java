package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseRepo;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.caisseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaisseServiceImpl implements caisseService {

  @Autowired
  CaisseRepo caisseRepo;

  @Override
  @Cacheable(value = "products", key = "'allProducts'")
  public List<Item> getAllProducts() {
    return caisseRepo.findAllWithCategoryForCaisse() ;
  }
}
