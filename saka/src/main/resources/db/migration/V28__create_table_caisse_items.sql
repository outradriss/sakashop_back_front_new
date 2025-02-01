CREATE TABLE caisses_items (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             item_id BIGINT NOT NULL, -- Référencera items
                             caisse_id BIGINT NOT NULL, -- Référencera addcaisse

  -- Contraintes de clé étrangère
                             CONSTRAINT fk_items FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,
                             CONSTRAINT fk_caisses FOREIGN KEY (caisse_id) REFERENCES addcaisse (id) ON DELETE CASCADE
);

-- Ajouter des index pour optimiser les requêtes
CREATE INDEX idx_items_id ON caisses_items (item_id);
CREATE INDEX idx_caisses_id ON caisses_items (caisse_id);
