package com.example.sakashop.Controllers;

import com.example.sakashop.Configurations.TokenProvider;
import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.LoginUser;
import com.example.sakashop.Entities.User;
import com.example.sakashop.controllers.UserController;
import com.example.sakashop.services.implServices.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

  private MockMvc mockMvc;

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private TokenProvider jwtTokenUtil;

  @Mock
  private UserServiceImpl userService;

  @InjectMocks
  private UserController userController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
  }

  @Test
  void testGenerateToken() throws Exception {
    LoginUser loginUser = new LoginUser();
    loginUser.setEmail("testUser@test.com");
    loginUser.setPassword("testPassword");

    Authentication authentication = new UsernamePasswordAuthenticationToken("testUser", "testPassword");
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
    when(jwtTokenUtil.generateToken(authentication)).thenReturn("mockToken");

    mockMvc.perform(post("/api/users/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"testUser\", \"password\":\"testPassword\"}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.token").value("mockToken"));
  }


  @Test
  void testSaveUser() throws Exception {
    UserDTO userDTO = new UserDTO();
    userDTO.setUsername("newUser");
    userDTO.setPassword("newPassword");

    User mockUser = new User();
    mockUser.setUsername("newUser");

    when(userService.save(any(UserDTO.class))).thenReturn(mockUser);

    mockMvc.perform(post("/api/users/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"newUser\", \"password\":\"newPassword\"}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.username").value("newUser"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void testAdminPing() throws Exception {
    mockMvc.perform(get("/api/users/adminping"))
      .andExpect(status().isOk())
      .andExpect(content().string("Only Admins Can Read This"));
  }

  @Test
  @WithMockUser(username = "user", roles = {"USER"})
  void testUserPing() throws Exception {
    mockMvc.perform(get("/api/users/userping"))
      .andExpect(status().isOk())
      .andExpect(content().string("Any User Can Read This"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void testGetAllUsers() throws Exception {
    User user1 = new User();
    user1.setUsername("user1");
    User user2 = new User();
    user2.setUsername("user2");

    when(userService.findAll()).thenReturn(List.of(user1, user2));

    mockMvc.perform(get("/api/users/find/all"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.length()").value(2))
      .andExpect(jsonPath("$[0].username").value("user1"))
      .andExpect(jsonPath("$[1].username").value("user2"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void testFindByUsername() throws Exception {
    User user = new User();
    user.setUsername("specificUser");

    when(userService.findOne("specificUser")).thenReturn(user);

    mockMvc.perform(get("/api/users/find/by/username")
        .param("username", "specificUser"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.username").value("specificUser"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void testCreateEmployee() throws Exception {
    UserDTO userDTO = new UserDTO();
    userDTO.setUsername("employeeUser");

    User mockUser = new User();
    mockUser.setUsername("employeeUser");

    when(userService.createEmployee(any(UserDTO.class))).thenReturn(mockUser);

    mockMvc.perform(post("/api/users/create/employee")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"employeeUser\"}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.username").value("employeeUser"));
  }
}
