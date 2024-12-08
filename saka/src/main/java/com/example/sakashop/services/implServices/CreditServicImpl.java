package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CreditRepo;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.services.creditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditServicImpl implements creditService {

   @Autowired
   CreditRepo creditRepo;


  @Override
  @Cacheable(value = "productForCredit", key = "'allProducts'")
  public List<Item> getAll() {
    return creditRepo.findAllForCreditWithCategoryForCaisse();
  }

}
