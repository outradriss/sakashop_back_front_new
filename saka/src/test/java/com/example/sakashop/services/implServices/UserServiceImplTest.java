package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.UserDAO;
import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.Role;
import com.example.sakashop.Entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

  @Mock
  private RoleServiceImpl roleService;

  @Mock
  private UserDAO userDao;

  @Mock
  private BCryptPasswordEncoder bcryptEncoder;

  @InjectMocks
  private UserServiceImpl userService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testLoadUserByUsername_UserExists() {
    // Arrange
    String email = "testUser@test.com";
    User mockUser = new User();
    mockUser.setUsername(email);
    mockUser.setPassword("password");
    Role role = new Role();
    role.setName("USER");
    mockUser.setRoles(Set.of(role));

    when(userDao.findByEmail(email)).thenReturn(mockUser);

    // Act
    UserDetails userDetails = userService.loadUserByUsername(email);

    // Assert
    assertNotNull(userDetails, "UserDetails should not be null");
    assertEquals(email, userDetails.getUsername(), "Username should match");
    assertEquals("password", userDetails.getPassword(), "Password should match");
    assertTrue(userDetails.getAuthorities().stream()
      .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")), "Authorities should contain ROLE_USER");

    verify(userDao, times(1)).findByEmail(email);
  }

  @Test
  void testLoadUserByUsername_UserNotFound() {
    // Arrange
    String email = "nonExistentUser";
    when(userDao.existsByEmail(email)).thenReturn(null);

    // Act & Assert
    assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername(email),
      "Should throw UsernameNotFoundException for non-existent user");

    verify(userDao, times(1)).findByEmail(email);
  }

  @Test
  void testFindAll() {
    // Arrange
    User user1 = new User();
    user1.setUsername("user1");
    User user2 = new User();
    user2.setUsername("user2");

    when(userDao.findAll()).thenReturn(List.of(user1, user2));

    // Act
    List<User> users = userService.findAll();

    // Assert
    assertNotNull(users, "User list should not be null");
    assertEquals(2, users.size(), "User list should contain 2 users");
    assertEquals("user1", users.get(0).getUsername());
    assertEquals("user2", users.get(1).getUsername());

    verify(userDao, times(1)).findAll();
  }

  @Test
  void testFindOne_UserExists() {
    // Arrange
    String email = "testUser@test.com";
    User mockUser = new User();
    mockUser.setUsername(email);

    when(userDao.findByEmail(email)).thenReturn(mockUser);

    // Act
    User user = userService.findOne(email);

    // Assert
    assertNotNull(user, "User should not be null");
    assertEquals(email, user.getUsername(), "Username should match");

    verify(userDao, times(1)).findByEmail(email);
  }

  @Test
  void testFindOne_UserNotFound() {
    // Arrange
    String email = "nonExistentUser";
    when(userDao.findByEmail(email)).thenReturn(null);

    // Act
    User user = userService.findOne(email);

    // Assert
    assertNull(user, "User should be null for non-existent username");

    verify(userDao, times(1)).findByEmail(email);
  }

  @Test
  void testSaveUser_WithDefaultRole() {
    // Arrange
    UserDTO userDTO = new UserDTO();
    userDTO.setUsername("testUser");
    userDTO.setPassword("password");
    userDTO.setEmail("user@test.com");

    Role userRole = new Role();
    userRole.setName("USER");

    User mockUser = new User();
    mockUser.setUsername(userDTO.getUsername());
    mockUser.setPassword("encodedPassword");

    // Initialiser les rôles
    Set<Role> roleSet = new HashSet<>();
    roleSet.add(userRole);
    mockUser.setRoles(roleSet);

    when(roleService.findByName("USER")).thenReturn(userRole);
    when(bcryptEncoder.encode(userDTO.getPassword())).thenReturn("encodedPassword");
    when(userDao.save(any(User.class))).thenReturn(mockUser);

    // Act
    User savedUser = userService.save(userDTO);

    // Assert
    assertNotNull(savedUser, "Saved user should not be null");
    assertEquals("testUser", savedUser.getUsername());
    assertEquals("encodedPassword", savedUser.getPassword());
    assertTrue(savedUser.getRoles().stream()
      .anyMatch(role -> role.getName().equals("USER")), "Roles should contain USER");

    verify(roleService, times(1)).findByName("USER");
    verify(bcryptEncoder, times(1)).encode(userDTO.getPassword());
    verify(userDao, times(1)).save(any(User.class));
  }

  @Test
  void testSaveUser_WithAdminEmail() {
    // Arrange
    UserDTO userDTO = new UserDTO();
    userDTO.setUsername("adminUser");
    userDTO.setPassword("password");
    userDTO.setEmail("admin@admin.edu");

    Role userRole = new Role();
    userRole.setName("USER");
    Role adminRole = new Role();
    adminRole.setName("ADMIN");

    User mockUser = new User();
    mockUser.setUsername(userDTO.getUsername());
    mockUser.setPassword("encodedPassword");

    // Initialiser les rôles
    Set<Role> roleSet = new HashSet<>();
    roleSet.add(userRole);
    roleSet.add(adminRole);
    mockUser.setRoles(roleSet); // Assurez-vous que la propriété 'roles' est initialisée

    when(roleService.findByName("USER")).thenReturn(userRole);
    when(roleService.findByName("ADMIN")).thenReturn(adminRole);
    when(bcryptEncoder.encode(userDTO.getPassword())).thenReturn("encodedPassword");
    when(userDao.save(any(User.class))).thenReturn(mockUser);

    // Act
    User savedUser = userService.save(userDTO);

    // Assert
    assertNotNull(savedUser, "Saved user should not be null");
    assertEquals("adminUser", savedUser.getUsername());
    assertEquals("encodedPassword", savedUser.getPassword());
    assertTrue(savedUser.getRoles().stream()
      .anyMatch(role -> role.getName().equals("USER")), "Roles should contain USER");
    assertTrue(savedUser.getRoles().stream()
      .anyMatch(role -> role.getName().equals("ADMIN")), "Roles should contain ADMIN");

    verify(roleService, times(1)).findByName("USER");
    verify(roleService, times(1)).findByName("ADMIN");
    verify(bcryptEncoder, times(1)).encode(userDTO.getPassword());
    verify(userDao, times(1)).save(any(User.class));
  }

}
