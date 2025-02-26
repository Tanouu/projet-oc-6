package com.openclassrooms.mddapi.dto;


public class RegisterDto {

//  @NotBlank(message = "L'email ne doit pas être vide")
//  @Email(message = "L'email doit être valide")
  private String email;

//  @NotBlank(message = "Le nom ne doit pas être vide")
  private String name;
//
//  @NotBlank(message = "Le mot de passe ne doit pas être vide")
  private String password;

  public RegisterDto(String email, String name, String password) {
    this.email = email;
    this.name = name;
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
