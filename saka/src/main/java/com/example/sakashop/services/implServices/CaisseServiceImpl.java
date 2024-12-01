package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CaisseOrderRepo;
import com.example.sakashop.DAO.CaisseRepo;
import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.Order;
import com.example.sakashop.services.caisseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CaisseServiceImpl implements caisseService {

  @Autowired
  CaisseRepo caisseRepo;

  @Autowired
  CaisseOrderRepo caisseOrderRepo;

  @Override
  @Cacheable(value = "products", key = "'allProducts'")
  public List<Item> getAllProducts() {
    return caisseRepo.findAllWithCategoryForCaisse();
  }

  @Transactional
  public void saveOrders(List<OrderRequestDTO> orders) {
    List<Order> orderEntities = orders.stream().map(orderDTO -> {
      Order order = new Order();
      order.setNameProduct(orderDTO.getNameProduct());
      order.setQuantity(orderDTO.getQuantity());
      order.setQuantityAddedUrgent(orderDTO.getQuantityAddedUrgent());
      order.setIsPromo(orderDTO.getIsPromo());
      order.setPricePromo(orderDTO.getPricePromo());
      order.setSalesPrice(orderDTO.getSalesPrice());
      order.setDateOrder(orderDTO.getDateOrder());
      order.setLastUpdated(orderDTO.getLastUpdated());
      return order;
    }).toList();

    caisseOrderRepo.saveAll(orderEntities);
  }

}
