import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';

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

  // Gestion des erreurs
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigateByUrl('/');
  }

  onSubmit() {
    // Nettoyage
    localStorage.clear();
    this.errorMessage = '';
    this.fieldErrors = {};

    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.sessionService.logIn(response.user);
        this.router.navigate(['/topics']);
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          // Gestion des erreurs par champ
          this.fieldErrors = err.error;
        } else {
          this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        }
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
