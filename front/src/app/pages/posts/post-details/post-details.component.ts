import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import {PostDetails} from "../../../model/post-details";
import {PostService} from "../../../services/post.service";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  postDetails?: PostDetails;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.postService.getPostDetails(postId).subscribe({
        next: (data) => this.postDetails = data,
        error: (err) => console.error('Erreur lors du chargement du post', err)
      });
    }
  }
}
