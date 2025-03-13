import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResponse } from '../model/subscription-response';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionService]
    });

    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait s’abonner à un topic', () => {
    const topicId = 1;
    const mockResponse: SubscriptionResponse = { message: 'Inscription réussie' };

    service.subscribe(topicId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/subscriptions/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ topicId });
    req.flush(mockResponse);
  });

  it('devrait se désabonner d’un topic', () => {
    const topicId = 1;

    service.unsubscribe(topicId).subscribe(response => {
      expect(response).toBe('Désinscription réussie');
    });

    const req = httpMock.expectOne(`/api/subscriptions/unsubscribe/${topicId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Désinscription réussie');
  });

  it('devrait gérer une erreur de désabonnement', () => {
    const topicId = 1;

    service.unsubscribe(topicId).subscribe({
      error: (error) => {
        expect(error.message).toBe('Erreur de désabonnement');
      }
    });

    const req = httpMock.expectOne(`/api/subscriptions/unsubscribe/${topicId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Erreur serveur', { status: 500, statusText: 'Internal Server Error' });
  });

});
