import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private sessionService: SessionService) {
    this.isLoading$ = this.sessionService.isLoading$(); // ✅ Suivi du chargement
  }

  ngOnInit(): void {}
}
