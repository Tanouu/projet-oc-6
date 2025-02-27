import { Component, OnInit } from '@angular/core';
import {Topic} from "../../model/topic";
import {TopicService} from "../../services/topic.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  topics: Topic[] = []; // Stocke les thèmes récupérés

  constructor(private topicService: TopicService) {
  }

  ngOnInit(): void {
    this.loadTopics()
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => this.topics = data,
      error: (err) => console.error('Erreur lors du chargement des topics', err)
    });
  }
}
