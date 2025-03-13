import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { PostService } from '../../../services/post.service';
import { TopicService } from '../../../services/topic.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceMock: any;
  let topicServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    postServiceMock = {
      createPost: jest.fn().mockReturnValue(of({})) // Simule la création de post avec succès
    };

    topicServiceMock = {
      getTopics: jest.fn().mockReturnValue(of([{ id: 1, name: 'Tech' }, { id: 2, name: 'Gaming' }])) // Mock des topics
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      imports: [FormsModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: TopicService, useValue: topicServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Pour éviter l'erreur de `app-nav-bar`
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔄 Déclenche `ngOnInit()`
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit charger les thèmes au démarrage', () => {
    expect(topicServiceMock.getTopics).toHaveBeenCalled();
    expect(component.topics.length).toBe(2);
  });

  it('doit afficher le formulaire avec les champs nécessaires', () => {
    const titleInput = fixture.debugElement.query(By.css('input[name="title"]'));
    const contentTextarea = fixture.debugElement.query(By.css('textarea[name="content"]'));
    const selectTopic = fixture.debugElement.query(By.css('select[name="topic"]'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(titleInput).toBeTruthy();
    expect(contentTextarea).toBeTruthy();
    expect(selectTopic).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('ne doit pas soumettre un formulaire incomplet', () => {
    component.postForm = { title: '', content: '', topicId: 0 };
    component.submitPost();

    expect(postServiceMock.createPost).not.toHaveBeenCalled();
  });

  it('doit envoyer un article valide et rediriger après création', () => {
    component.postForm = { title: 'Test', content: 'Contenu du test', topicId: 1 };
    component.submitPost();

    expect(postServiceMock.createPost).toHaveBeenCalledWith(component.postForm);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('doit afficher une erreur si la création échoue', () => {
    console.error = jest.fn(); // Espionner console.error pour vérifier l'erreur

    postServiceMock.createPost.mockReturnValue(throwError(() => new Error('Erreur de création')));

    component.postForm = { title: 'Test', content: 'Contenu du test', topicId: 1 };
    component.submitPost();

    expect(console.error).toHaveBeenCalledWith("Erreur lors de la création de l’article", expect.any(Error));
  });

  it('doit naviguer en arrière lorsqu’on clique sur le bouton retour', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
