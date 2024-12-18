package com.example.sakashop.Configurations;

import com.example.sakashop.Entities.Item;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableBatchProcessing // Active les fonctionnalités de Spring Batch
public class BatchConfig {

  @Bean
  public Job batchJob(JobBuilderFactory jobBuilderFactory, Step step) {
    return jobBuilderFactory.get("checkExpiredDateJob")
      .start(step) // Ajoute une seule étape pour le moment
      .build();
  }

  @Bean
  public Step step(StepBuilderFactory stepBuilderFactory, ItemReader<Item> reader, ItemProcessor<Item, Item> processor, ItemWriter<Item> writer) {
    return stepBuilderFactory.get("checkExpiredDateStep")
      .<Item, Item>chunk(10) // Taille du chunk : nombre d’éléments à traiter à la fois
      .reader(reader)
      .processor(processor)
      .writer(writer)
      .build();
  }
}
