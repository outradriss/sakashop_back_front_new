-- 1. Supprimer toutes les relations dans USER_ROLES
DELETE FROM USER_ROLES;

-- 2. Supprimer tous les utilisateurs dans USERS
DELETE FROM USER;

-- 3. Supprimer tous les rôles dans ROLES
DELETE FROM ROLE;

-- 4. Réinitialiser les identifiants auto-incrémentés (optionnel)
ALTER TABLE USER_ROLES AUTO_INCREMENT = 1;
ALTER TABLE USER AUTO_INCREMENT = 1;
ALTER TABLE ROLE AUTO_INCREMENT = 1;

-- 5. Ajouter le rôle "CAISSIER"
INSERT INTO ROLE (id, name, description) VALUES
  (1, 'CAISSIER', 'Role de caissier');

-- 6. Ajouter l'utilisateur "drissoutraah@gmail.com"
INSERT INTO USER (id, username, password, email, phone, name , c_password) VALUES
  (1, 'drissoutraah', '$2a$10$k.u55d8KzYkeau0zOtpFXOuyMyuhL8lDs0DcVlcriZbeGdomhIK26', 'drissoutraah@gmail.com', '0661234567', 'Driss Outraah','$2a$10$k.u55d8KzYkeau0zOtpFXOuyMyuhL8lDs0DcVlcriZbeGdomhIK26');

-- Note : Remplacez $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxx par un mot de passe haché (ex. BCrypt).
-- Vous pouvez générer un mot de passe haché avec un encodeur BCrypt en Java.

-- 7. Associer l'utilisateur au rôle
INSERT INTO USER_ROLES (user_id, role_id) VALUES
  (1, 1);
