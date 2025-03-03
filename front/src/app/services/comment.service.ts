import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {AddComment} from "../model/add-comment";


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = '/api/comments';

  constructor(private http: HttpClient) {}

  addComment(comment: AddComment): Observable<void> {
    return this.http.post<void>(this.apiUrl, comment);
  }
}
