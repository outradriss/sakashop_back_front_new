package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CreditRepo;
import com.example.sakashop.DAO.ItemsOrdersREpo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.CreditDTO;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Entities.ItemsOrders;
import com.example.sakashop.Exceptions.ResourceNotFoundException;
import com.example.sakashop.services.creditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CreditServicImpl implements creditService {

  private final CreditRepo creditRepository;
  private final ProductRepository itemRepository;

  public CreditServicImpl(CreditRepo creditRepository, ProductRepository itemRepository) {
    this.creditRepository = creditRepository;
    this.itemRepository = itemRepository;
  }


  @Override
  @Cacheable(value = "productForCredit", key = "'allProducts'")
  public List<Item> getAll() {
    return creditRepository.findAllForCreditWithCategoryForCaisse();
  }

  public List<Credit> getAllCredits() {
    return creditRepository.findAll();
  }


  @Override
  public Credit createCredit(CreditDTO creditRequest) {
    try {
      // Récupérer le produit à partir du nom
      Optional<Item> productOpt = itemRepository.findByName(creditRequest.getProductName());
      if (productOpt.isEmpty()) {
        throw new ResourceNotFoundException("Produit introuvable : " + creditRequest.getProductName());
      }

      Item product = productOpt.get();

      // Créer une nouvelle entité Credit
      Credit credit = new Credit();
      credit.setNameClient(creditRequest.getClientName());
      credit.setComment(creditRequest.getComment());
      credit.setLocalDateTime(creditRequest.getCreditDate());
      credit.setDatePayCredit(creditRequest.getDueDate());
      credit.setProduct(product);
      credit.setQuantity(creditRequest.getQuantity());
      credit.setTotale(creditRequest.getTotal());

      // Enregistrer dans la base de données
      return creditRepository.save(credit);

    } catch (Exception ex) {
      throw new RuntimeException("Une erreur s'est produite lors de la création du crédit.", ex);
    }
  }




}
