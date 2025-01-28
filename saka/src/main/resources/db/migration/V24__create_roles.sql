

-- 5. Ajouter le rôle "CAISSIER"
INSERT INTO ROLE (id, name, description) VALUES
  (2, 'ADMIN', 'Role admin');

-- 6. Ajouter l'utilisateur "drissoutraah@gmail.com"
INSERT INTO USER (id, username, password, email, phone, name , c_password) VALUES
  (2, 'admin', '$2a$10$k.u55d8KzYkeau0zOtpFXOuyMyuhL8lDs0DcVlcriZbeGdomhIK26', 'admin@admin.com', '0661234567', 'Driss Outraah','$2a$10$k.u55d8KzYkeau0zOtpFXOuyMyuhL8lDs0DcVlcriZbeGdomhIK26');


-- 7. Associer l'utilisateur au rôle
INSERT INTO USER_ROLES (user_id, role_id) VALUES
  (2, 2);
