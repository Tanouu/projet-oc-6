import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TopicService } from './topic.service';
import { Topic } from '../model/topic';

describe('TopicService', () => {
  let service: TopicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TopicService]
    });

    service = TestBed.inject(TopicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait récupérer la liste des topics', () => {
    const mockTopics: Topic[] = [
      { id: 1, name: 'Angular', description: 'Framework front-end' },
      { id: 2, name: 'Spring Boot', description: 'Framework back-end' }
    ];

    service.getTopics().subscribe(topics => {
      expect(topics.length).toBe(2);
      expect(topics).toEqual(mockTopics);
    });

    const req = httpMock.expectOne('/api/topics');
    expect(req.request.method).toBe('GET');
    req.flush(mockTopics);
  });

  it('ne doit pas envoyer d’autres requêtes après récupération des topics', () => {
    httpMock.expectNone('/api/topics');
  });

});
