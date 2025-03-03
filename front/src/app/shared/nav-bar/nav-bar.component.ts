import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SessionService } from "../../services/session.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isLogged$: Observable<boolean>;

  constructor(private sessionService: SessionService, private router: Router) {
    this.isLogged$ = this.sessionService.isLogged$();
  }

  ngOnInit(): void {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
