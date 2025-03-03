import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {}

  public canActivate(): Observable<boolean> {
    return combineLatest([
      this.sessionService.isLogged$(), // Suivi de l'état de connexion
      this.sessionService.isLoading$() // Suivi du chargement
    ]).pipe(
      map(([isLogged, isLoading]) => {
        if (isLoading) {
          return false; // ⏳ On attend la fin du chargement avant de prendre une décision
        }
        if (!isLogged) {
          this.router.navigate(["/login"]);
          return false;
        }
        return true;
      })
    );
  }
}
