-- Ajouter la colonne `id_orders_items` à la table `orders`
ALTER TABLE orders
ADD COLUMN id_orders_items BIGINT;

-- Ajouter une clé étrangère liant `id_orders_items` à `items_orders(id)`
ALTER TABLE orders
ADD CONSTRAINT fk_orders_items FOREIGN KEY (id_orders_items) REFERENCES items_orders(id);
