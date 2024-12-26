//package com.example.sakashop.Configurations.processor;
//
//import com.example.sakashop.Entities.Item;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.batch.item.ItemProcessor;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//
//@Component
//public class ItemProcessorConfig implements ItemProcessor<Item, Item> {
//
//  private static final Logger log = LoggerFactory.getLogger(ItemProcessorConfig.class);
//  @Override
//  public Item process(Item item) throws Exception {
//
//    LocalDate now = LocalDate.now();
//    LocalDate expiredDate = item.getExpiredDate();
//
//    if (expiredDate.isAfter(now.plusDays(30))) {
//      log.info("Item ignoré (valide) : {}", item);
//      return null;
//    } else if (expiredDate.isAfter(now) && expiredDate.isBefore(now.plusDays(30))) {
//      item.setExpiredDate(now.plusDays(30));
//      log.info("Item mis à jour (moins de 30 jours) : {}", item);
//    } else {
//      item.setExpiredDate(now.plusDays(30));
//      log.info("Item mis à jour (expiré) : {}", item);
//    }
//
//    return item; // Renvoie l'item transformé pour l'écriture
//  }
//}
