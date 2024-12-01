CREATE TABLE orders (
    id_order BIGINT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique de la commande
    name_product VARCHAR(255) NOT NULL,        -- Nom du produit
    quantity INT NOT NULL,                     -- Quantité commandée
    quantity_added_urgent INT NOT NULL,        -- Quantité ajoutée en urgence
    is_promo BOOLEAN NOT NULL,                 -- Indique si le produit est en promotion
    price_promo DECIMAL(10, 2),                -- Prix en promotion
    date_order TIMESTAMP NOT NULL,             -- Date de la commande
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Dernière mise à jour
);
