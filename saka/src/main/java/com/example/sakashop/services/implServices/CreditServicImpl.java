package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.CreditRepo;
import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.DTO.CreditDTO;
import com.example.sakashop.Entities.Credit;
import com.example.sakashop.Entities.Item;
import com.example.sakashop.Exceptions.DatabaseException;
import com.example.sakashop.Exceptions.InsufficientStockException;
import com.example.sakashop.Exceptions.InvalidDataException;
import com.example.sakashop.Exceptions.ResourceNotFoundException;
import com.example.sakashop.controllers.CreditController;
import com.example.sakashop.services.creditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CreditServicImpl implements creditService {

  private static final Logger log = LoggerFactory.getLogger(CreditController.class);


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
  @Transactional
  @CacheEvict(value = "productForCredit", allEntries = true)
  public Credit createCredit(CreditDTO creditRequest) {
    try {
      // Récupérer le produit à partir du nom
      Optional<Item> productOpt = itemRepository.findByName(creditRequest.getProductName());
      if (productOpt.isEmpty()) {
        throw new ResourceNotFoundException("Produit introuvable : " + creditRequest.getProductName());
      }

      Item product = productOpt.get();

      // Vérifier si la quantité demandée est disponible
      int currentStock = product.getQuantity();
      int requestedQuantity = creditRequest.getQuantity();
      if (product.getQuantity() < creditRequest.getQuantity()) {
        String errorMessage = String.format(
          "La quantité modifiée (%d) dépasse le stock disponible (%d) pour le produit : %s.",
          requestedQuantity, currentStock, creditRequest.getProductName());
        log.error(errorMessage);
        throw new InvalidDataException(errorMessage);
      }

      // Mettre à jour la quantité du produit dans la table items
      int updatedRows = itemRepository.decrementItemQuantity(product.getId(), creditRequest.getQuantity());
      if (updatedRows == 0) {
        throw new InsufficientStockException("Échec de la mise à jour de la quantité pour le produit : " + creditRequest.getProductName());
      }

      // Créer une nouvelle entité Credit
      Credit credit = new Credit();
      credit.setNameClient(creditRequest.getNameClient());
      credit.setComment(creditRequest.getComment());
      credit.setLocalDateTime(creditRequest.getLocalDateTime());
      credit.setDatePayCredit(creditRequest.getDatePayCredit());
      credit.setProduct(product);
      credit.setQuantity(creditRequest.getQuantity());
      credit.setTotale(creditRequest.getTotale());

      // Enregistrer dans la base de données
      return creditRepository.save(credit);

    } catch (ResourceNotFoundException ex) {
      log.error("Erreur de ressource introuvable: {}", ex.getMessage());
      throw ex;
    } catch (IllegalArgumentException ex) {
      log.error("Données invalides fournies: {}", ex.getMessage());
      throw new InvalidDataException("Les données fournies sont invalides.", ex);
    } catch (InsufficientStockException ex) {
      log.error("Stock insuffisant: {}", ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      log.error("Erreur inattendue lors de la création du crédit: ", ex);
      throw new DatabaseException("Une erreur interne s'est produite. Veuillez réessayer plus tard.", ex);
    }
  }


  @Transactional
  @Override
  @CacheEvict(value = "productForCredit", allEntries = true)
  public void deleteCredit(Long id) {
    log.info("Tentative de suppression du crédit avec l'ID: {}", id);

    try {
      // Étape 1 : Vérification de l'existence du crédit
      Credit credit = findCreditById(id);
      log.info("Crédit trouvé: {}", credit);

      // Étape 2 : Incrémenter la quantité de l'item associé
      incrementItemQuantity(credit.getProduct().getId(), credit.getQuantity());

      // Étape 3 : Supprimer le crédit
      creditRepository.delete(credit);
      log.info("Crédit supprimé avec succès pour l'ID: {}", id);

    } catch (ResourceNotFoundException ex) {
      log.warn("Erreur : Crédit introuvable avec l'ID: {}", id);
      throw ex; // Renvoyer l'exception pour le contrôleur
    } catch (InvalidDataException ex) {
      log.warn("Erreur : Données invalides lors de la mise à jour de l'item associé: {}", ex.getMessage());
      throw ex; // Renvoyer l'exception pour le contrôleur
    } catch (Exception ex) {
      log.error("Erreur inattendue lors de la suppression du crédit: ", ex);
      throw new DatabaseException("Une erreur interne s'est produite lors de la suppression du crédit.", ex);
    }
  }

  private void incrementItemQuantity(Long itemId, int quantity) {
    try {
      log.info("Tentative de mise à jour de la quantité pour l'item avec l'ID: {}", itemId);

      int updatedRows = itemRepository.incrementItemQuantity(itemId, quantity);

      if (updatedRows == 0) {
        throw new InvalidDataException("Impossible de mettre à jour la quantité pour l'item ID : " + itemId);
      }

      log.info("Quantité mise à jour avec succès pour l'item ID: {}", itemId);

    } catch (InvalidDataException ex) {
      log.warn("Erreur lors de l'incrémentation de la quantité pour l'item ID: {}: {}", itemId, ex.getMessage());
      throw ex; // Renvoyer l'exception pour le contrôleur
    } catch (Exception ex) {
      log.error("Erreur inattendue lors de la mise à jour de la quantité pour l'item ID: {}", itemId, ex);
      throw new DatabaseException("Une erreur interne s'est produite lors de la mise à jour de la quantité de l'item.", ex);
    }
  }


  @Override
  @Transactional
  @CacheEvict(value = "productForCredit", allEntries = true)
  public void payCredit(Long id) {
    log.info("Début de la suppression du crédit avec l'ID: {}", id);

    try {
      // Étape 1 : Vérification de l'existence du crédit
      Credit credit = creditRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Crédit introuvable avec l'ID : " + id));

      log.info("Crédit trouvé: {}", credit);

      // Étape 2 : Suppression du crédit
      creditRepository.delete(credit);
      log.info("Crédit supprimé avec succès: {}", id);

    } catch (ResourceNotFoundException ex) {
      log.warn("Erreur lors de la suppression: Crédit introuvable: {}", ex.getMessage());
      throw ex; // Propager l'exception pour une gestion au niveau du contrôleur
    } catch (DataAccessException ex) {
      log.error("Erreur d'accès à la base de données lors de la suppression du crédit avec l'ID: {}", id, ex);
      throw new DatabaseException("Impossible de supprimer le crédit. Une erreur de base de données est survenue.", ex);
    } catch (Exception ex) {
      log.error("Erreur inattendue lors de la suppression du crédit avec l'ID: {}", id, ex);
      throw new RuntimeException("Une erreur inattendue s'est produite lors de la suppression du crédit.", ex);
    }
  }




  private Credit findCreditById(Long id) {
    return creditRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Crédit non trouvé avec l'ID : " + id));
  }



  @Override
  @Transactional
  @CacheEvict(value = "productForCredit", allEntries = true)
  public Credit updateCredit(Long id, CreditDTO creditRequest) {
    log.info("Demande de mise à jour du crédit avec l'ID: {}", id);

    try {
      // Étape 1 : Vérification de l'existence du crédit
      Credit existingCredit = creditRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Crédit introuvable avec l'ID : " + id));
      log.info("Crédit existant trouvé: {}", existingCredit);

      // Étape 2 : Vérification de l'existence du produit
      Item product = itemRepository.findByName(creditRequest.getProductName())
        .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + creditRequest.getProductName()));
      log.info("Produit trouvé: {}", product);

      // Étape 3 : Vérification de la quantité disponible
      int currentStock = product.getQuantity();
      int previousQuantity = existingCredit.getQuantity();
      int requestedQuantity = creditRequest.getQuantity();

      if ((currentStock + previousQuantity - requestedQuantity) < 0) {
        String errorMessage = String.format(
          "La quantité modifiée (%d) dépasse le stock disponible (%d) pour le produit : %s.",
          requestedQuantity, currentStock, creditRequest.getProductName());
        log.error(errorMessage);
        throw new InvalidDataException(errorMessage);
      }

      // Étape 4 : Mise à jour de la quantité en stock
      product.setQuantity(currentStock + previousQuantity - requestedQuantity);
      itemRepository.save(product);
      log.info("Quantité mise à jour pour le produit: {}", product);

      // Étape 5 : Mise à jour des champs du crédit existant
      existingCredit.setNameClient(creditRequest.getNameClient());
      existingCredit.setComment(creditRequest.getComment());
      existingCredit.setLocalDateTime(creditRequest.getLocalDateTime());
      existingCredit.setUpdatedDate(LocalDateTime.now());
      existingCredit.setDatePayCredit(creditRequest.getDatePayCredit());
      existingCredit.setProduct(product);
      existingCredit.setQuantity(requestedQuantity);
      existingCredit.setTotale(creditRequest.getTotale());
      log.info("Crédit mis à jour avec succès: {}", existingCredit);

      return creditRepository.save(existingCredit);

    } catch (ResourceNotFoundException ex) {
      log.warn("Erreur de ressource introuvable: {}", ex.getMessage());
      throw ex;
    } catch (InvalidDataException ex) {
      log.warn("Erreur de validation des données: {}", ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      log.error("Erreur inattendue lors de la mise à jour du crédit.", ex);
      throw new DatabaseException("Une erreur interne s'est produite lors de la mise à jour du crédit.", ex);
    }
  }






}
