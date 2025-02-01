package com.example.sakashop.DTO;

import com.example.sakashop.Entities.User;

import javax.persistence.Column;


public class UserDTO {

    private String username;
    private String password;
    private String email;
    private String phone;
    private String name;
    @Column(name = "c_password")
    private String cPassword;

  public String getcPassword() {
    return cPassword;
  }

  public void setcPassword(String cPassword) {
    this.cPassword = cPassword;
  }

  public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUserFromDto(){
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setPhone(phone);
        user.setName(name);

        return user;
    }

}
