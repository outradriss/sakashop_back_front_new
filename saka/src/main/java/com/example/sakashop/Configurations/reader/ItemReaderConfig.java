package com.example.sakashop.Configurations.reader;

import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ItemReaderConfig implements ItemReader<Item> {

  private static final Logger log = LoggerFactory.getLogger(ItemReaderConfig.class);

  private final ProductRepository itemRepository;
  private List<Item> itemsToCheck; // Liste temporaire pour le buffer
  private int currentIndex = 0;    // Index pour suivre la lecture

  public ItemReaderConfig(ProductRepository itemRepository) {
    this.itemRepository = itemRepository;
  }

  @Override
  public Item read() throws Exception {
    try {
      // Initialisation de la liste si nécessaire
      if (itemsToCheck == null) {
        log.info("Chargement des items depuis la base de données...");
        itemsToCheck = itemRepository.findItemsToCheck();
        currentIndex = 0; // Réinitialiser l'index
        log.info("Nombre d'items à vérifier : {}", itemsToCheck.size());
      }

      // Vérifier si tous les items ont été lus
      if (currentIndex >= itemsToCheck.size()) {
        log.info("Tous les items ont été traités.");
        return null; // Signal de fin de lecture
      }

      // Lire le prochain item
      Item item = itemsToCheck.get(currentIndex++);
      log.debug("Item lu : {}", item);
      return item;

    } catch (Exception ex) {
      log.error("Erreur lors de la lecture des items depuis la base de données :", ex);
      throw ex; // Relancer l'exception pour que Spring Batch la gère
    }
  }
}
