import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailsComponent } from './post-details.component';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { SessionService } from '../../../services/session.service';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PostDetailsComponent', () => {
  let component: PostDetailsComponent;
  let fixture: ComponentFixture<PostDetailsComponent>;
  let postServiceMock: any;
  let commentServiceMock: any;
  let sessionServiceMock: any;
  let activatedRouteMock: any;
  let isLoggedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedSubject = new BehaviorSubject<boolean>(false);

    sessionServiceMock = {
      isLogged$: isLoggedSubject.asObservable(),
      user: { id: 1, name: 'TestUser' }
    };

    postServiceMock = {
      getPostDetails: jest.fn().mockReturnValue(of({
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        createdAt: new Date().toISOString(),
        userName: 'TestUser',
        topicName: 'Test Topic',
        comments: []
      }))
    };

    commentServiceMock = {
      addComment: jest.fn().mockReturnValue(of({}))
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1') // Simule un post avec ID 1
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailsComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔄 Déclenche `ngOnInit()`
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher les détails du post', () => {
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h1.text-center'));
    const content = fixture.debugElement.query(By.css('p'));

    expect(title.nativeElement.textContent.trim()).toBe('Test Post');
    expect(content.nativeElement.textContent.trim()).toBe('Test Content');
  });

  it('doit ajouter un commentaire et l’afficher', () => {
    component.newComment = 'Nouveau commentaire';
    component.addComment();
    fixture.detectChanges();

    expect(commentServiceMock.addComment).toHaveBeenCalled();

    const commentList = fixture.debugElement.queryAll(By.css('.list-group-item'));
    expect(commentList.length).toBe(1);
    expect(commentList[0].nativeElement.textContent).toContain('Nouveau commentaire');
  });

  it('ne doit pas envoyer un commentaire vide', () => {
    component.newComment = ' ';
    component.addComment();
    expect(commentServiceMock.addComment).not.toHaveBeenCalled();
  });
});
