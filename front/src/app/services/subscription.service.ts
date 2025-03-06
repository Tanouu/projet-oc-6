import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {SubscriptionResponse} from "../model/subscription-response";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = '/api/subscriptions';

  constructor(private http: HttpClient) {}

  subscribe(topicId: number): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/subscribe`, { topicId });
  }

  unsubscribe(topicId: number): Observable<any> {
    return this.http.delete(`/api/subscriptions/unsubscribe/${topicId}`, { responseType: 'text' }).pipe(
      catchError(error => {
        return throwError(() => new Error("Erreur de désabonnement"));
      })
    );
  }

}
