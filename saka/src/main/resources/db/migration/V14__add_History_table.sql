CREATE TABLE History (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique
    item_id BIGINT NOT NULL,              -- Référence à l'item
    order_id BIGINT NOT NULL,             -- Référence à la commande
    items_orders_id BIGINT NOT NULL,      -- Référence à ItemsOrders
    name VARCHAR(255) NOT NULL,           -- Nom du produit (lié à Item)
    product_added_date DATETIME NOT NULL, -- Date d'ajout du produit (lié à Item)
    stock_quantity INT NOT NULL,          -- Quantité en stock (lié à Item)
    cart_quantity INT NOT NULL,           -- Quantité commandée (lié à ItemsOrders)
    added_quantity INT NOT NULL,          -- Quantité ajoutée (spécifique à History)
    date_integration DATETIME NOT NULL,   -- Date d'intégration (lié à ItemsOrders)
    sales_price DECIMAL(10, 2) NOT NULL,  -- Prix de vente (lié à ItemsOrders)
    price_promo DECIMAL(10, 2),           -- Prix promo (lié à ItemsOrders)
    nego_price DECIMAL(10, 2),            -- Prix négocié (lié à ItemsOrders)
    totale_price DECIMAL(10, 2),          -- Total de la commande (lié à Order)
    date_order DATETIME NOT NULL,         -- Date de la commande (lié à Order)
    date_update DATETIME,                 -- Date de mise à jour (lié à ItemsOrders)
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (id_order) ON DELETE CASCADE,
    FOREIGN KEY (items_orders_id) REFERENCES items_orders (id) ON DELETE CASCADE
);
