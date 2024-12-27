package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CancelRepository;
import com.example.sakashop.Entities.Cancel;
import com.example.sakashop.services.CancelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CancelServiceImpl implements CancelService {

  @Autowired
  private CancelRepository cancelRepository;

  @Override
  public Cancel saveCancel(Cancel cancel) {
    return cancelRepository.save(cancel);
  }

  @Override
  public List<Cancel> getCancelByItemId(Long itemId) {
    return cancelRepository.findByItemId(itemId);
  }
}
