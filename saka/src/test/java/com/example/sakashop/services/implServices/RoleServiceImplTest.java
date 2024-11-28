package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.RoleDAO;
import com.example.sakashop.Entities.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoleServiceImplTest {

  @Mock
  private RoleDAO roleDao;

  @InjectMocks
  private RoleServiceImpl roleService;

  private AutoCloseable closeable;

  @BeforeEach
  void setUp() {
    closeable = MockitoAnnotations.openMocks(this);
  }

  @Test
  void testFindByName() {
    // Arrange
    String roleName = "ADMIN";
    Role mockRole = new Role();
    mockRole.setName(roleName);

    // Simuler le comportement du DAO
    when(roleDao.findRoleByName(roleName)).thenReturn(mockRole);

    // Act
    Role result = roleService.findByName(roleName);

    // Assert
    assertNotNull(result, "The role should not be null");
    assertEquals(roleName, result.getName(), "The role name should match the expected value");

    // Vérifier que la méthode DAO a été appelée
    verify(roleDao, times(1)).findRoleByName(roleName);
  }

  @Test
  void testFindByNameReturnsNull() {
    // Arrange
    String roleName = "NON_EXISTENT";
    when(roleDao.findRoleByName(roleName)).thenReturn(null);

    // Act
    Role result = roleService.findByName(roleName);

    // Assert
    assertNull(result, "The result should be null for a non-existent role");

    // Vérifier que la méthode DAO a été appelée
    verify(roleDao, times(1)).findRoleByName(roleName);
  }
}
