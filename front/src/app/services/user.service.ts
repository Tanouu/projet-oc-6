import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.interface';
import { UserUpdate } from '../model/user-update';
import {UserProfile} from "../model/user-profile";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`/api/user/profile`);
  }

  updateProfile(userUpdate: UserUpdate): Observable<UserProfile> {
    return this.http.put<UserProfile>(`/api/user/me`, userUpdate);
  }
}
