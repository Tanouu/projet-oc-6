import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { SubscriptionService } from '../../services/subscription.service';
import {UserProfile} from "../../model/user-profile";
import {UserService} from "../../services/user.service";
import {UserUpdate} from "../../model/user-update";
import {Router} from "@angular/router";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile; // Stocke le profil utilisateur
  userUpdate: UserUpdate = { name: '', email: '', password: '' };
  isUpdating = false; // Pour désactiver le bouton pendant l'envoi
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
        this.userUpdate.name = data.name;
        this.userUpdate.email = data.email;
      },
      error: (err) => console.error('Erreur chargement profil', err),
    });
  }


  unsubscribe(topicId: number): void {
    if (!this.userProfile) return;

    this.subscriptionService.unsubscribe(topicId).subscribe({
      next: () => {
        this.userProfile!.subscriptions = this.userProfile!.subscriptions.filter(topic => topic.id !== topicId);
        alert('Désabonnement réussi !');
      },
      error: (err) => alert('Erreur : ' + err.error?.message || 'Impossible de se désabonner.')
    });
  }

  saveProfile(): void {
    this.isUpdating = true;
    this.fieldErrors = {};

    // Clone de l'objet pour ne pas modifier le `userUpdate` directement lié au formulaire
    const updatePayload: any = { ...this.userUpdate };

    // Si le champ password est vide, on le supprime de la requête
    if (!updatePayload.password || updatePayload.password.trim() === '') {
      delete updatePayload.password;
    }

    this.userService.updateProfile(updatePayload).subscribe({
      next: (updatedUser) => {
        this.userProfile = updatedUser;
        this.sessionService.logIn(updatedUser);
        alert('Profil mis à jour avec succès !');
        this.isUpdating = false;
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.fieldErrors = err.error;
        } else {
          alert('Erreur lors de la mise à jour du profil.');
        }
        console.error('Erreur mise à jour profil', err);
        this.isUpdating = false;
      },
    });
  }



  logout(): void {
    this.sessionService.logOut();
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }
}
