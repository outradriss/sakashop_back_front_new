package com.example.sakashop.DTO;

import javax.validation.constraints.NotNull;

public class PasswordDTO {
  @NotNull(message = "Le mot de passe ne peut pas être nul")
  private String password;

  // Getters et Setters
  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
