import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Topic} from "../model/topic";
import {Post} from "../model/post";
import {PostDetails} from "../model/post-details";
import {PostForm} from "../model/post-form";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = '/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {

    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostDetails(postId: number): Observable<PostDetails> {
    return this.http.get<PostDetails>(`${this.apiUrl}/details/${postId}`);
  }

  createPost(post: PostForm): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }
}
