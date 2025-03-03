import {Component, OnInit} from '@angular/core';
import {SessionService} from "./services/session.service";
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {User} from "./model/user.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  title = 'front';

}
