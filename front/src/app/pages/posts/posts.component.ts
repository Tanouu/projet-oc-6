import { Component, OnInit } from '@angular/core';
import {Topic} from "../../model/topic";
import {TopicService} from "../../services/topic.service";
import {Post} from "../../model/post";
import {PostService} from "../../services/post.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];
  selectedPost: number | null = null;

  constructor(private postService: PostService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadPosts()
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Erreur lors du chargement des topics', err)
    });
  }

  selectPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }
}
