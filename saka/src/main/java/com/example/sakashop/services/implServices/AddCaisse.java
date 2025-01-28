package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.AddCaisseRepo;
import com.example.sakashop.DAO.RoleDAO;
import com.example.sakashop.DAO.UserDAO;
import com.example.sakashop.DTO.AddCaisseDTO;
import com.example.sakashop.Entities.Caisse;
import com.example.sakashop.Entities.Role;
import com.example.sakashop.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddCaisse {
  @Autowired
  private AddCaisseRepo caisseRepository;

  @Autowired
  private UserDAO userRepository;

  @Autowired
  private RoleDAO roleRepository;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  public Caisse addCaisse(AddCaisseDTO caisseDTO) {
    if (caisseRepository.existsByNom(caisseDTO.getUtilisateur())) {
      throw new RuntimeException("Une caisse avec ce nom existe déjà !");
    }
    // Étape 1 : Enregistrer dans la table AddCaisse
    Caisse caisse = new Caisse();
    caisse.setNom(caisseDTO.getNom());
    caisse.setPays(caisseDTO.getPays());
    caisse.setVille(caisseDTO.getVille());
    caisse.setUtilisateur(caisseDTO.getUtilisateur());
    caisse.setPassword(caisseDTO.getPassword());
    caisse.setRole("CAISSIER"); // Rôle par défaut
    Caisse savedCaisse = caisseRepository.save(caisse);

    // Étape 2 : Ajouter l'utilisateur dans la table User

    if (userRepository.existsByEmail(caisseDTO.getUtilisateur())) {
      throw new RuntimeException("Un utilisateur avec cet email existe déjà !");
    }
    User user = new User();
    user.setEmail(caisseDTO.getUtilisateur()); // Utilisateur = email
    user.setPassword(passwordEncoder.encode(caisseDTO.getPassword())); // Cryptage du mot de passe
    user.setcPassword(passwordEncoder.encode(caisseDTO.getPassword()));

    // Récupérer la partie avant '@' de l'email pour le username
    String email = caisseDTO.getUtilisateur();
    String username = email.contains("@") ? email.split("@")[0] : email; // Gestion si l'email n'a pas '@'
    user.setUsername(username);

    userRepository.save(user);

    // Étape 3 : Ajouter le rôle dans la table Role ou le récupérer s'il existe
    Role role = roleRepository.findRoleByName("CAISSIER");
    if (role == null) {
      role = new Role();
      role.setName("CAISSIER");
      role.setDescription("Rôle assigné automatiquement depuis addCaisse");
      roleRepository.save(role);
    }

    // Étape 4 : Associer l'utilisateur et le rôle
    user.getRoles().add(role);
    userRepository.save(user);

    return savedCaisse;
  }

  public List<Caisse> getAllCaisses() {
    return caisseRepository.findAll();
  }

}
