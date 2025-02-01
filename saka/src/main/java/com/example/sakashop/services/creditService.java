package com.example.sakashop.services;

import com.example.sakashop.DAO.CreditRepo;
import com.example.sakashop.DTO.CreditDTO;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface creditService {

  List<Item> getAll();

  Credit createCredit(CreditDTO creditRequestt);

  @Transactional
  void deleteCredit(Long id);

  @Transactional
  void payCredit(Long id);

  Credit updateCredit(Long id, CreditDTO creditRequest);
}
