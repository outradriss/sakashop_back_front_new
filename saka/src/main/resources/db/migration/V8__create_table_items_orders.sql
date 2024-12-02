-- Créer la table items_orders
CREATE TABLE items_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_integration DATETIME NOT NULL,
    date_update DATETIME,
    stock_quantity INT NOT NULL,
    cart_quantity INT NOT NULL,
    CONSTRAINT fk_items_orders_order_id FOREIGN KEY (order_id) REFERENCES orders (id_order),
    CONSTRAINT fk_items_orders_item_id FOREIGN KEY (item_id) REFERENCES items (id)
);
