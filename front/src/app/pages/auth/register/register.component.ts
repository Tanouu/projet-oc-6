import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import {SessionService} from "../../../services/session.service";

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

  constructor(private authService: AuthService, private sessionService: SessionService, private router: Router) {}

  onSubmit() {
    localStorage.clear();
    this.authService.register(this.registerRequest).subscribe({
      next:response => {
        console.log('Inscription réussie');
        localStorage.setItem('token', response.token);
        this.sessionService.logIn(response.user);
        this.router.navigate(['/topics']);
      },
      error: err => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
