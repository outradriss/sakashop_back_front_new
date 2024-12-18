package com.example.sakashop.Configurations.writer;

import com.example.sakashop.DAO.ProductRepository;
import com.example.sakashop.Entities.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ItemWriterConfig implements ItemWriter<Item> {
  Logger log = LoggerFactory.getLogger(ItemWriterConfig.class);

  private final ProductRepository itemRepository;

  public ItemWriterConfig(ProductRepository itemRepository) {
    this.itemRepository = itemRepository;
  }

  @Override
  public void write(List<? extends Item> items) throws Exception {
    log.info("Écriture des items dans la base de données : {}", items);
    itemRepository.saveAll(items);
    log.info("Items sauvegardés avec succès.");
  }

}
