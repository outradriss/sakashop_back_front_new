package com.example.sakashop.Controllers;

import com.example.sakashop.Configurations.TokenProvider;
import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.AuthToken;
import com.example.sakashop.Entities.LoginUser;
import com.example.sakashop.Entities.User;
import com.example.sakashop.controllers.UserController;
import com.example.sakashop.services.implServices.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private TokenProvider jwtTokenUtil;

  @Mock
  private UserServiceImpl userService;

  @InjectMocks
  private UserController userController;

  private LoginUser loginUser;
  private UserDTO userDTO;
  private User user;

  @BeforeEach
  void setUp() {
    loginUser = new LoginUser();
    loginUser.setEmail("testuser");
    loginUser.setPassword("password");

    userDTO = new UserDTO();
    userDTO.setUsername("testuser");
    userDTO.setPassword("password");
    userDTO.setEmail("testuser@example.com");

    user = new User();
    user.setUsername("testuser");
    user.setEmail("testuser@example.com");

    // Initialisation des mocks
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGenerateToken() throws Exception {
    // Mock the authentication
    Authentication authentication = mock(Authentication.class);
    when(authenticationManager.authenticate(any())).thenReturn(authentication);
    when(jwtTokenUtil.generateToken(authentication)).thenReturn("mocked-token");

    ResponseEntity<?> response = userController.generateToken(loginUser);

    assertEquals(200, response.getStatusCodeValue());
    assertNotNull(response.getBody());
    assertTrue(response.getBody() instanceof AuthToken);
    assertEquals("mocked-token", ((AuthToken) response.getBody()).getToken());
  }

  @Test
  void testSaveUser() {
    // Mock the userService behavior
    when(userService.save(any(UserDTO.class))).thenReturn(user);

    ResponseEntity<User> response = userController.saveUser(userDTO);

    assertEquals(200, response.getStatusCodeValue());
    assertNotNull(response.getBody());
    assertEquals("testuser", response.getBody().getUsername());
  }

  @Test
  @WithMockUser(roles = "ADMIN")
  void testAdminPing() {
    ResponseEntity<String> response = userController.adminPing();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals("Only Admins Can Read This", response.getBody());
  }

  @Test
  @WithMockUser(roles = "USER")
  void testUserPing() {
    ResponseEntity<String> response = userController.userPing();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals("Any Users Can Read This", response.getBody());
  }

  @Test
  void testCreateEmployee() {
    // Mock the userService behavior
    when(userService.createEmployee(any(UserDTO.class))).thenReturn(ResponseEntity.ok(user));

    ResponseEntity<User> response = userController.createEmployee(userDTO);

    assertEquals(200, response.getStatusCodeValue());
    assertNotNull(response.getBody());
    assertEquals("testuser", response.getBody().getUsername());
  }

  @Test
  void testGetAllUsers() {
    // Simuler le service qui retourne une liste d'utilisateurs
    when(userService.findAll()).thenReturn(ResponseEntity.ok(List.of(user)));

    ResponseEntity<List<User>> response = userController.getAllList();

    // Vérifications des assertions
    assertEquals(200, response.getStatusCodeValue()); // Vérifie que le code HTTP est 200
    assertNotNull(response.getBody()); // Vérifie que le corps de la réponse n'est pas null
    assertEquals(1, response.getBody().size()); // Vérifie que la liste contient un utilisateur
  }



  @Test
  void testGetUserByUsername() {
    when(userService.findOne("testuser")).thenReturn(user);

    ResponseEntity<User> response = userController.getAllList("testuser");

    assertEquals(200, response.getStatusCodeValue());
    assertNotNull(response.getBody());
    assertEquals("testuser", response.getBody().getUsername());
  }
}
