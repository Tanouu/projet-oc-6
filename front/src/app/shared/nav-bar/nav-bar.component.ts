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

  ngOnInit(): void {
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url;

    if (route === '/posts' && (currentUrl.startsWith('/post/') || currentUrl === '/create-post')) {
      return true;
    }

    return currentUrl === route;
  }
}
