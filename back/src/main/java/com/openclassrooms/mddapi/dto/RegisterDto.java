package com.openclassrooms.mddapi.dto;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class RegisterDto {

  @NotBlank(message = "L'email ne doit pas être vide")
  @Email(message = "L'email doit être valide")
  private String email;

  @NotBlank(message = "Le nom ne doit pas être vide")
  private String name;

  @NotBlank(message = "Le mot de passe ne doit pas être vide")
  @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
  @Pattern(
          regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
          message = "Le mot de passe doit contenir au moins un chiffre, une lettre minuscule, une lettre majuscule et un caractère spécial."
  )
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
