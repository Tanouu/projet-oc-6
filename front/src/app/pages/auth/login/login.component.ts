import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {SessionService} from "../../../services/session.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginRequest = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private sessionService: SessionService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginRequest).subscribe({
      next: response => {
        console.log('Connexion réussie', response);
        localStorage.setItem('token', response.token);
        this.sessionService.logIn(response.user);
        this.router.navigate(['/topics']);
      },
      error: err => {
        console.error('Erreur lors de la connexion', err);
      }
    });
  }
}
