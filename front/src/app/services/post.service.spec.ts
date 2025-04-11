import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../model/post';
import { PostDetails } from '../model/post-details';
import { PostForm } from '../model/post-form';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer tous les posts avec GET', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Contenu 1', createdAt: '2025-03-13', userName: 'User1' },
      { id: 2, title: 'Post 2', content: 'Contenu 2', createdAt: '2025-03-13', userName: 'User2' }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('/api/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('devrait récupérer les détails d’un post avec GET', () => {
    const mockPostDetails: PostDetails = {
      id: 1,
      title: 'Post 1',
      content: 'Contenu 1',
      createdAt: '2025-03-13',
      userName: 'User1',
      topicName: 'Angular',
      comments: [{ id: 1, content: 'Super post !', userName: 'User2' }]
    };

    service.getPostDetails(1).subscribe(details => {
      expect(details).toEqual(mockPostDetails);
    });

    const req = httpMock.expectOne('/api/posts/details/1'); // ✅ URL avec l'ID
    expect(req.request.method).toBe('GET'); // ✅ GET au lieu de POST
    expect(req.request.body).toBeNull(); // ✅ pas de body pour un GET
    req.flush(mockPostDetails);
  });

  it('devrait créer un post avec POST', () => {
    const newPost: PostForm = { title: 'Nouveau Post', content: 'Contenu du post', topicId: 3 };

    service.createPost(newPost).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('/api/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush({ success: true });
  });
});
