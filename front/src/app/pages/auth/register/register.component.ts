import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { SessionService } from "../../../services/session.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerRequest = {
    email: '',
    password: '',
    name: ''
  };

  errorMessage: string = '';  // Ajout de la propriété pour le message d'erreur

  constructor(private authService: AuthService, private sessionService: SessionService, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/');
  }

  onSubmit() {
    localStorage.clear();
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        console.log('Inscription réussie');
        localStorage.setItem('token', response.token);
        this.sessionService.logIn(response.user);
        this.router.navigate(['/topics']);
      },
      error: (err) => {
        // Si la connexion échoue, on met à jour le message d'erreur
        if (err.error.message) {
          this.errorMessage = err.error.message;  // Mettre à jour le message d'erreur
        }
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
