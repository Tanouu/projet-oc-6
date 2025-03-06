import { Component, OnInit } from '@angular/core';
import { Topic } from "../../model/topic";
import { TopicService } from "../../services/topic.service";
import { SubscriptionService } from "../../services/subscription.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];

  constructor(private topicService: TopicService, private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => this.topics = data,
      error: (err) => console.error('Erreur lors du chargement des topics', err)
    });
  }

  subscribeToTopic(topicId: number): void {
    this.subscriptionService.subscribe(topicId).subscribe({
      next: (response) => alert(response.message),
      error: (err) => {
        console.error("Erreur lors de l'abonnement :", err);
        const errorMessage = err.error?.message || "Une erreur est survenue";
        alert('Erreur : ' + errorMessage);
      }
    });
  }
}
