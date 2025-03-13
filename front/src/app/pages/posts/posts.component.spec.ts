import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPosts: jest.fn().mockReturnValue(of([
        { id: 1, title: 'Post 1', content: 'Contenu du post 1', userName: 'User1', createdAt: '2025-03-13T00:00:00Z' },
        { id: 2, title: 'Post 2', content: 'Contenu du post 2', userName: 'User2', createdAt: '2025-03-12T00:00:00Z' }
      ])) // ✅ Simule le retour d'une liste de posts
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PostsComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Ignore les erreurs liées à `<app-nav-bar>`
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔄 Déclenche `ngOnInit()`
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit charger les posts au démarrage', () => {
    expect(postServiceMock.getPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(2);
    expect(component.posts[0].title).toBe('Post 1');
  });

  it('doit afficher les posts dans la liste', () => {
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.card'));
    expect(cards.length).toBe(2);

    const firstPostTitle = cards[0].query(By.css('.card-title')).nativeElement.textContent.trim();
    expect(firstPostTitle).toBe('Post 1');
  });

  it('doit appeler `selectPost` et naviguer au bon post', () => {
    component.selectPost(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/post', 1]);
  });

  it('doit afficher un message d’erreur si le chargement des posts échoue', () => {
    console.error = jest.fn(); // Espionner `console.error`

    postServiceMock.getPosts.mockReturnValue(throwError(() => new Error('Erreur de chargement')));

    component.loadPosts();

    expect(console.error).toHaveBeenCalledWith('Erreur lors du chargement des topics', expect.any(Error));
  });

});
