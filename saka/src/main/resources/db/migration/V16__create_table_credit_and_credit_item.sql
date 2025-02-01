-- Création de la table Credit
CREATE TABLE Credit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    date_credit DATETIME NOT NULL,
    date_update DATETIME DEFAULT NULL,
    date_pay DATETIME DEFAULT NULL,
    total BIGINT NOT NULL,
    CONSTRAINT fk_credit_item FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Création de la table intermédiaire credit_item
CREATE TABLE credit_item (
    credit_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    PRIMARY KEY (credit_id, item_id),
    CONSTRAINT fk_credit_item_credit FOREIGN KEY (credit_id) REFERENCES Credit (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT fk_credit_item_item FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;
