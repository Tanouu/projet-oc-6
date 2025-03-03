import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { TopicsComponent } from './pages/topics/topics.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import {FormsModule} from "@angular/forms";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PostDetailsComponent } from './pages/posts/post-details/post-details.component';
import { CreatePostComponent } from './pages/posts/create-post/create-post.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, TopicsComponent, RegisterComponent, LoginComponent, NavBarComponent, PostsComponent, PostDetailsComponent, CreatePostComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
