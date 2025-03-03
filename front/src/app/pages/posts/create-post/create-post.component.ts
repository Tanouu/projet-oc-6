import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PostForm} from "../../../model/post-form";
import {PostService} from "../../../services/post.service";
import {TopicService} from "../../../services/topic.service";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm: PostForm = { title: '', content: '', topicId: 0 };
  topics: { id: number; name: string }[] = []; // Liste des thèmes

  constructor(private postService: PostService, private topicService: TopicService, private router: Router) {}

  ngOnInit(): void {
    // Charger les thèmes disponibles
    this.topicService.getTopics().subscribe({
      next: (topics) => (this.topics = topics),
      error: (err) => console.error('Erreur lors du chargement des thèmes', err),
    });
  }

  /** 🔙 Retour à la page précédente */
  goBack(): void {
    this.router.navigate(['/posts']);
  }

  /** ✅ Envoi du formulaire */
  submitPost(): void {
    if (!this.postForm.title || !this.postForm.content || this.postForm.topicId === 0) return;

    this.postService.createPost(this.postForm).subscribe({
      next: () => {
        console.log('Article créé avec succès !');
        this.router.navigate(['/posts']); // Redirection après création
      },
      error: (err) => console.error('Erreur lors de la création de l’article', err),
    });
  }
}
