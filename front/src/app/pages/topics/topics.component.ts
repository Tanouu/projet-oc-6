import { Component, OnInit } from '@angular/core';
import { Topic } from "../../model/topic";
import { TopicService } from "../../services/topic.service";
import { SubscriptionService } from "../../services/subscription.service";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  subscribedTopicsIds: number[] = []; // Stocke les IDs des thèmes auxquels l'utilisateur est abonné

  constructor(private topicService: TopicService, private subscriptionService: SubscriptionService, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loadTopics();
    this.loadUserSubscriptions();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => this.topics = data,
    });
  }

  loadUserSubscriptions(): void {
    this.sessionService.getUserProfile().subscribe({
      next: (profile) => {
        this.subscribedTopicsIds = profile.subscriptions.map(sub => sub.id);
      },
    });
  }

  isSubscribed(topicId: number): boolean {
    return this.subscribedTopicsIds.includes(topicId);
  }

  subscribeToTopic(topicId: number): void {
    this.subscriptionService.subscribe(topicId).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadUserSubscriptions(); // Recharge la liste des abonnements
        this.loadTopics(); // Recharge les thèmes pour mettre à jour les boutons
      },
      error: (err) => {
        const errorMessage = err.error?.message || "Une erreur est survenue";
        alert('Erreur : ' + errorMessage);
      }
    });
  }
}
