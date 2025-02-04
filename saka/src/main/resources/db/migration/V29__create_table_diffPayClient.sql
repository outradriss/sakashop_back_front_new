-- ✅ Vérifier si la table existe avant de la créer
CREATE TABLE IF NOT EXISTS diffItemsPrice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_order_change VARCHAR(255) NOT NULL,
    diffPayClient BIGINT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Ajouter un index pour améliorer les performances sur `id_order_change`
CREATE INDEX idx_diffItemsPrice_idOrderChange ON diffItemsPrice (id_order_change);
