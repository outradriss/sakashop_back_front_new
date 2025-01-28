-- Création de la table passwordCaisse
CREATE TABLE IF NOT EXISTS passwordCaisse (
                                            id_caisse BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            password VARCHAR(255) NOT NULL
  );

-- Insérer des valeurs initiales
INSERT INTO passwordCaisse (password) VALUES
                                        ('admin123'),
                                        ('caisse2024');
