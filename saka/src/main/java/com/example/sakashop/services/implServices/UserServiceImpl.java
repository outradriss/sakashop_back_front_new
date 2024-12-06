package com.example.sakashop.services.implServices;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.sakashop.DAO.UserDAO;
import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.Role;
import com.example.sakashop.Entities.User;
import com.example.sakashop.services.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, userService {

    @Autowired
    private RoleServiceImpl roleService;

    @Autowired
    private UserDAO userDao;

    @Autowired
    private BCryptPasswordEncoder bcryptEncoder;

  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User response = userDao.findByEmail(username);

    // Vérification que la réponse n'est pas null et contient un corps valide
    if (response == null) {
      throw new UsernameNotFoundException("Invalid username or password.");
    }

    User user = response; // Récupération de l'objet User encapsulé dans ResponseEntity
    return new org.springframework.security.core.userdetails.User(
      user.getEmail(),
      user.getPassword(),
      getAuthority(user)
    );
  }

  // Get user authorities
  private Set<SimpleGrantedAuthority> getAuthority(User user) {
    Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    user.getRoles().forEach(role -> {
      authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
    });
    return authorities;
  }


  // Find all users
    public ResponseEntity<List<User>> findAll() {
      List<User> list = new ArrayList<>();
      userDao.findAll().forEach(list::add);

      if (list.isEmpty()) {
        return ResponseEntity.noContent().build(); // Retourne 204 si la liste est vide
      }

      return ResponseEntity.ok(list); // Retourne 200 avec la liste des utilisateurs
    }


  // Find user by username
    @Override
    public User findOne(String username) {
        return userDao.findByUsername(username);
    }

    // Save user
    @Override
    public User save(UserDTO user) {

        User nUser = user.getUserFromDto();
        nUser.setPassword(bcryptEncoder.encode(user.getPassword()));

        // Set default role as USER
        Role role = roleService.findByName("USER");
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(role);

        // If email domain is admin.edu, add ADMIN role
        if(nUser.getEmail().split("@")[1].equals("admin.edu")){
            role = roleService.findByName("ADMIN");
            roleSet.add(role);
        }

        nUser.setRoles(roleSet);
        return userDao.save(nUser);
    }

    @Override
    public ResponseEntity<User> createEmployee(UserDTO user) {
      // Conversion du DTO en entité User
      User nUser = user.getUserFromDto();
      nUser.setPassword(bcryptEncoder.encode(user.getPassword()));

      // Récupération des rôles nécessaires
      Role employeeRole = roleService.findByName("EMPLOYEE");
      Role customerRole = roleService.findByName("USER");

      // Ajout des rôles à l'utilisateur
      Set<Role> roleSet = new HashSet<>();
      if (employeeRole != null) {
        roleSet.add(employeeRole);
      }
      if (customerRole != null) {
        roleSet.add(customerRole);
      }

      nUser.setRoles(roleSet);

      // Sauvegarde de l'utilisateur
      User savedUser = userDao.save(nUser);

      // Retourne une réponse HTTP 201 Created avec l'utilisateur créé
      return ResponseEntity.status(201).body(savedUser);
    }

}
