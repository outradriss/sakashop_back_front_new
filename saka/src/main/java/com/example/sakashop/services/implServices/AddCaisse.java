package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.*;
import com.example.sakashop.DTO.AddCaisseDTO;
import com.example.sakashop.Entities.Caisse;
import com.example.sakashop.Entities.Role;
import com.example.sakashop.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddCaisse {
  @Autowired
  private AddCaisseRepo caisseRepository;

  @Autowired
  private UserDAO userRepository;

  @Autowired
  private RoleDAO roleRepository;

  @Autowired
  private OrderRepo ordersREpo;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  public Caisse addCaisse(AddCaisseDTO caisseDTO) {
    if (caisseRepository.existsByNom(caisseDTO.getUtilisateur())) {
      throw new RuntimeException("Une caisse avec ce nom existe déjà !");
    }

    // Étape 1 : Enregistrer dans la table AddCaisse (avec mot de passe crypté)
    Caisse caisse = new Caisse();
    caisse.setNom(caisseDTO.getNom());
    caisse.setPays(caisseDTO.getPays());
    caisse.setVille(caisseDTO.getVille());
    caisse.setUtilisateur(caisseDTO.getUtilisateur());
    caisse.setPassword(passwordEncoder.encode(caisseDTO.getPassword()));
    caisse.setRole("CAISSIER");
    Caisse savedCaisse = caisseRepository.save(caisse);

    // Étape 2 : Créer l'utilisateur lié
    if (userRepository.existsByEmail(caisseDTO.getUtilisateur())) {
      throw new RuntimeException("Un utilisateur avec cet email existe déjà !");
    }

    User user = new User();
    user.setEmail(caisseDTO.getUtilisateur());
    user.setPassword(passwordEncoder.encode(caisseDTO.getPassword()));
    user.setcPassword(passwordEncoder.encode(caisseDTO.getPassword()));

    String email = caisseDTO.getUtilisateur();
    String username = email.contains("@") ? email.split("@")[0] : email;
    user.setUsername(username);


    user.setCaisse(savedCaisse);

    // Étape 3 : Rôle
    Role role = roleRepository.findRoleByName("CAISSIER");
    if (role == null) {
      role = new Role();
      role.setName("CAISSIER");
      role.setDescription("Rôle assigné automatiquement depuis addCaisse");
      roleRepository.save(role);
    }

    // Étape 4 : Associer rôle à l'utilisateur
    user.getRoles().add(role);
    userRepository.save(user);

    return savedCaisse;
  }


  public List<Caisse> getAllCaisses() {
    return caisseRepository.findAll();
  }

  public void deleteCaisseById(Long id) {
    Optional<Caisse> caisseOpt = caisseRepository.findById(id);
    if (caisseOpt.isEmpty()) {
      throw new RuntimeException("Caisse non trouvée avec l'ID : " + id);
    }

    Caisse caisse = caisseOpt.get();

    // Vérifie si la caisse est utilisée dans des commandes
    if (!ordersREpo.findByCaisse(caisse).isEmpty()) {
      throw new RuntimeException("Impossible de supprimer la caisse : elle est utilisée dans des commandes.");
    }

    // Supprimer l'utilisateur lié à cette caisse
    Optional<User> userOpt = userRepository.findByCaisse(caisse);
    userOpt.ifPresent(user -> {
      user.getRoles().clear();           // Nettoyer les rôles dans la table de jointure
      userRepository.save(user);         // Sauvegarde sans les rôles pour éviter la violation de contrainte
      userRepository.delete(user);       // Maintenant on peut le supprimer sans souci
    });

    caisseRepository.delete(caisse);
  }



  public Caisse updateCaisse(Long id, AddCaisseDTO dto) {
    Caisse caisse = caisseRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Caisse non trouvée avec l'ID : " + id));

    caisse.setNom(dto.getNom());
    caisse.setPays(dto.getPays());
    caisse.setVille(dto.getVille());
    caisse.setUtilisateur(dto.getUtilisateur());

    if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
      caisse.setPassword(passwordEncoder.encode(dto.getPassword()));
    }

    Caisse updatedCaisse = caisseRepository.save(caisse);

    Optional<User> userOpt = userRepository.findByCaisse(caisse);
    if (userOpt.isPresent()) {
      User user = userOpt.get();
      user.setEmail(dto.getUtilisateur());

      if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setcPassword(passwordEncoder.encode(dto.getPassword()));
      }

      String username = dto.getUtilisateur().contains("@") ? dto.getUtilisateur().split("@")[0] : dto.getUtilisateur();
      user.setUsername(username);

      userRepository.save(user);
    }

    return updatedCaisse;
  }

}
