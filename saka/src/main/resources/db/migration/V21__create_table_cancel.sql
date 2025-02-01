CREATE TABLE Cancel (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      item_id BIGINT NOT NULL,
                      reason VARCHAR(255) NOT NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES Items(id)
);
