import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Topic} from "../model/topic";

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = '/api/topics';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<Topic[]> {

    return this.http.get<Topic[]>(this.apiUrl);
  }
}
