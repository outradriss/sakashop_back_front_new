ALTER TABLE orders
ADD COLUMN item_id BIGINT,
ADD CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(id);
