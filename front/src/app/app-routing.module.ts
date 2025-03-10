import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {LoginComponent} from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {TopicsComponent} from "./pages/topics/topics.component";
import {AuthGuard} from "./guards/auth.guard";
import {PostsComponent} from "./pages/posts/posts.component";
import {PostDetailsComponent} from "./pages/posts/post-details/post-details.component";
import {CreatePostComponent} from "./pages/posts/create-post/create-post.component";
import {ProfileComponent} from "./pages/profile/profile.component";

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
  { path: 'topics', component: TopicsComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostDetailsComponent, canActivate: [AuthGuard] },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
