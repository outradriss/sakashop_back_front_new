package com.example.sakashop.services;

import com.example.sakashop.Entities.Cancel;

import java.util.List;

public interface CancelService {
  Cancel saveCancel(Cancel cancel);

  List<Cancel> getCancelByItemId(Long itemId);
}
