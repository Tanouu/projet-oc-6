package com.openclassrooms.mddapi.dto;


public class LoginDto {
//
//        @NotNull
//        @NotBlank
//        @Email
        private String email;

//        @NotBlank
//        @NotNull
        private String password;

        public LoginDto() {
        }

        public LoginDto(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

    @Override
    public String toString() {
        return "LoginDto{" +
                "username='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
