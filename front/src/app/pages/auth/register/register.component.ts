import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        console.log('Inscription réussie');
        this.router.navigate(['/topics']); // Redirection après inscription
      },
      error: err => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
