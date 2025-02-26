import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import {Topic} from "../../model/topic";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  topics: Topic[] = []; // Stocke les thèmes récupérés

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    console.log('Hello world');
    this.topicService.getTopics().subscribe({
      next: (data) => this.topics = data,
      error: (err) => console.error('Erreur lors du chargement des topics', err)
    });
  }
}
