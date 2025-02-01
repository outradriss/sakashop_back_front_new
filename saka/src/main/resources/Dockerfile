# Utiliser l'image de base Kafka Connect de Debezium
FROM debezium/connect:2.4

# Copier le fichier plugin local vers l'image Docker
COPY debezium-connector-mysql-2.4.0.Final-plugin.tar.gz /tmp/

# Extraire le fichier dans le répertoire des plugins Kafka Connect
RUN mkdir -p /kafka/connect/debezium-connector-mysql \
    && tar -xzvf /tmp/debezium-connector-mysql-2.4.0.Final-plugin.tar.gz -C /kafka/connect/debezium-connector-mysql
