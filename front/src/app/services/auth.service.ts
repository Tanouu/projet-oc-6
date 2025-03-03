import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {User} from "../model/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pathService = '/api/auth';

  constructor(private httpClient: HttpClient) {}

  public login(loginRequest: any): Observable<any> {
    return this.httpClient.post<any>(`${this.pathService}/login`, loginRequest).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  public register(registerRequest: any): Observable<any> {
    return this.httpClient.post<any>(`${this.pathService}/register`, registerRequest).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  public me(): Observable<User> {
    return this.httpClient.get<User>(`${this.pathService}/me`);
  }

}
