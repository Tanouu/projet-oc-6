import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Topic} from "../model/topic";
import {Post} from "../model/post";
import {PostDetails} from "../model/post-details";

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
    return this.http.post<PostDetails>(`${this.apiUrl}/details`, { postId });
  }
}
