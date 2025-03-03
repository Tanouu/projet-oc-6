import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDetails } from '../../../model/post-details';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { SessionService } from '../../../services/session.service';
import {AddComment} from "../../../model/add-comment";
import {Comment} from "../../../model/comment";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  postDetails?: PostDetails;
  newComment: string = '';
  userId: number = 0; // ✅ Initialise avec une valeur par défaut
  userName: string = 'Utilisateur inconnu'; // ✅ Initialise avec une valeur par défaut

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Vérifie que l'utilisateur est défini avant d'assigner son nom
    if (this.sessionService.user) {
      this.userId = this.sessionService.user.id || 0;
      this.userName = this.sessionService.user.name || 'Utilisateur inconnu'; // ✅ Évite `undefined`
    }

    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.postService.getPostDetails(postId).subscribe({
        next: (data) => this.postDetails = data,
        error: (err) => console.error('Erreur lors du chargement du post', err)
      });
    }
  }

  /** 🔥 Ajouter un commentaire */
  addComment(): void {
    if (!this.newComment.trim() || !this.postDetails) return; // Vérification

    const commentData: AddComment = {
      content: this.newComment,
      postId: this.postDetails.id
    };

    this.commentService.addComment(commentData).subscribe({
      next: () => {
        console.log("Commentaire ajouté !");

        // ✅ Utilisation sûre de `userName`
        const newComment: Comment = {
          id: Date.now(),
          userName: this.userName, // ✅ Toujours une valeur valide
          content: this.newComment
        };

        this.postDetails!.comments.push(newComment);
        this.newComment = ''; // Réinitialisation
      },
      error: (err) => console.error('Erreur lors de l’ajout du commentaire', err)
    });
  }
}
