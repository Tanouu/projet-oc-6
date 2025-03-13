import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { AddComment } from '../model/add-comment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête POST pour ajouter un commentaire', () => {
    const mockComment: AddComment = {
      content: 'Un super commentaire !',
      postId: 1,
    };

    service.addComment(mockComment).subscribe();

    const req = httpMock.expectOne('/api/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);
    req.flush(null);
  });
});
