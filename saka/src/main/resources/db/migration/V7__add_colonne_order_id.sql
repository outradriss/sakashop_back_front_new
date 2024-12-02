-- Vérifiez ou modifiez le type de la colonne `idOrder` pour qu'il soit cohérent
ALTER TABLE orders MODIFY COLUMN id_order BIGINT NOT NULL;

-- Ajouter la colonne `order_id` à la table `items`
ALTER TABLE items
ADD COLUMN order_id BIGINT;

-- Ajout de l'index sur la clé référencée si nécessaire
ALTER TABLE orders ADD INDEX idx_idOrder (id_order);

-- Ajouter la contrainte de clé étrangère
ALTER TABLE items
ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id_order);
