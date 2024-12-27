/*
package com.example.sakashop.Configurations;

import com.example.sakashop.DTO.OrderRequestDTO;
import com.example.sakashop.services.implServices.CaisseServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.StreamsConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;

import java.util.Map;
import java.util.Properties;

@Configuration
@EnableKafkaStreams
public class KafkaStreamsConfig {

  private final CaisseServiceImpl orderProcessingService;

  public KafkaStreamsConfig(CaisseServiceImpl orderProcessingService) {
    this.orderProcessingService = orderProcessingService;
  }

  // Configuration spécifique pour Kafka Streams
  @Bean
  public Properties kafkaStreamsProperties() {
    Properties props = new Properties();
    props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"); // Brokers Kafka
    props.put(StreamsConfig.APPLICATION_ID_CONFIG, "sakashop-streams-app"); // Identifiant de l'application Kafka Streams
    props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE); // Garantie de traitement
    props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, org.apache.kafka.common.serialization.Serdes.StringSerde.class); // Sérialisation des clés
    props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, org.apache.kafka.common.serialization.Serdes.StringSerde.class); // Sérialisation des valeurs
    return props;
  }

  // Configuration des streams Kafka

  @Bean
  public KStream<String, String> streamProcessor(StreamsBuilder streamsBuilder) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    KStream<String, String> inputStream = streamsBuilder.stream("mydb.sakashop.orders",
      Consumed.with(Serdes.String(), Serdes.String()));

    inputStream.foreach((key, value) -> {
      try {
        Map<String, Object> json = mapper.readValue(value, new TypeReference<>() {});
        Map<String, Object> after = (Map<String, Object>) json.get("after");

        if (after != null) {
          OrderRequestDTO order = mapper.convertValue(after, OrderRequestDTO.class);
          orderProcessingService.processOrderFromKafka(order);
        }
      } catch (Exception e) {
        System.err.println("Erreur Kafka : " + e.getMessage());
      }
    });

    return inputStream;
  }


}
*/
