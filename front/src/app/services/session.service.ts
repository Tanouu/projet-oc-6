import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../model/user.interface";
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public isLogged = false;
  public user: User | undefined;

  private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  public isLogged$(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log("SessionService initialisé. Token au démarrage:", localStorage.getItem('token'));
    this.autoLogin();
  }

  public logIn(user: User): void {
    this.user = user;
    this.isLogged = true;
    this.isLoadingSubject.next(false);
    this.fetchUser();
    this.next();
    this.router.navigate(['/topics']); // ✅ Redirection après connexion
  }

  public logOut(): void {
    localStorage.removeItem('token');
    this.user = undefined;
    this.isLogged = false;
    this.isLoadingSubject.next(false);
    this.next();
    this.router.navigate(['/login']); // ✅ Redirection après déconnexion
  }

  public autoLogin(): void {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Tentative de récupération de l'utilisateur...");
      this.fetchUser();
    } else {
      this.isLoadingSubject.next(false);
    }
  }

  private fetchUser(): void {
    this.httpClient.get<User>('/api/user/me').pipe(
      tap(user => {
        this.user = user;
        this.isLogged = true;
        this.isLoadingSubject.next(false);
        console.log("Utilisateur chargé:", user);
        this.next();

        const currentUrl = this.router.url;
        if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
          this.router.navigate(['/topics']);
        }
      }),
      catchError(() => {
        console.log("Erreur récupération utilisateur. Déconnexion...");
        this.logOut();
        return [];
      })
    ).subscribe();
  }

  private next(): void {
    this.isLoggedSubject.next(this.isLogged);
  }
}
