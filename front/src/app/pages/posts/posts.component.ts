import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  selectedPost: number | null = null;
  sortBy: 'date' | 'author' = 'date';
  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.sortPosts();
      },
      error: (err) => console.error('Erreur lors du chargement des posts', err)
    });
  }

  sortPosts(): void {
    if (this.sortBy === 'date') {
      this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortBy === 'author') {
      this.posts.sort((a, b) => a.userName.localeCompare(b.userName));
    }
  }

  changeSorting(criteria: 'date' | 'author'): void {
    this.sortBy = criteria;
    this.sortPosts();
  }

  selectPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }
}
