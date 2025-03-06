import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { SubscriptionService } from '../../services/subscription.service';
import {UserProfile} from "../../model/user-profile";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile; // Stocke le profil utilisateur

  constructor(
    private sessionService: SessionService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /** 🔥 Charger le profil utilisateur */
  loadUserProfile(): void {
    this.sessionService.getUserProfile().subscribe({
      next: (profile) => this.userProfile = profile,
      error: (err) => console.error('Erreur lors du chargement du profil', err)
    });
  }


  /** 🔥 Désabonnement */
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
}
