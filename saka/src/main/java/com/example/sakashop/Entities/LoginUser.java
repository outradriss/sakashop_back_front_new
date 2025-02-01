package com.example.sakashop.Entities;




import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser {
    private String Email;
    private String password;

  public String getEmail() {
    return Email;
  }

  public void setEmail(String email) {
    Email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
