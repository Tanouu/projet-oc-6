import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { SessionService } from "../../../services/session.service";

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

  errorMessage: string = '';  // Propriété pour afficher le message d'erreur

  constructor(private authService: AuthService, private sessionService: SessionService, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/');
  }

  onSubmit() {
    localStorage.clear();
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        console.log('Connexion réussie');
        localStorage.setItem('token', response.token);
        this.sessionService.logIn(response.user);
        this.router.navigate(['/topics']);
      },
      error: (err) => {
        // Si la connexion échoue, on met à jour le message d'erreur
        this.errorMessage = 'Identifiants incorrects';  // Message d'erreur
        console.error('Erreur lors de la connexion', err);
      }
    });
  }
}
