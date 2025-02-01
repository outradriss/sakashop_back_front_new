-- Création de la table AddCaisse
CREATE TABLE AddCaisse (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,           -- Identifiant unique de la caisse
                         nom VARCHAR(255) NOT NULL,                      -- Nom de la caisse
                         pays VARCHAR(255) NOT NULL,                     -- Pays de la caisse
                         ville VARCHAR(255) NOT NULL,                    -- Ville de la caisse
                         utilisateur VARCHAR(255) NOT NULL,              -- Utilisateur associé à la caisse
                         password VARCHAR(255) NOT NULL,                 -- Mot de passe de la caisse
                         role VARCHAR(50) NOT NULL DEFAULT 'CAISSIER',   -- Rôle associé (par défaut : CAISSIER)
                         date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date de création de la caisse
) ENGINE=InnoDB;
