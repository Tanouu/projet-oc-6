import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicsComponent } from './topics.component';
import { TopicService } from '../../services/topic.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('TopicsComponent', () => {
  let component: TopicsComponent;
  let fixture: ComponentFixture<TopicsComponent>;
  let topicServiceMock: any;
  let subscriptionServiceMock: any;
  let userServiceMock: any;

  beforeEach(async () => {
    topicServiceMock = {
      getTopics: jest.fn().mockReturnValue(of([
        { id: 1, name: 'Tech', description: 'Technologies modernes' },
        { id: 2, name: 'Gaming', description: 'Jeux vidéo' }
      ]))
    };

    subscriptionServiceMock = {
      subscribe: jest.fn().mockReturnValue(of({ message: 'Abonnement réussi !' }))
    };

    userServiceMock = {
      getUserProfile: jest.fn().mockReturnValue(of({
        subscriptions: [{ id: 1, name: 'Tech' }] // L'utilisateur est déjà abonné à 'Tech'
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [TopicsComponent],
      providers: [
        { provide: TopicService, useValue: topicServiceMock },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Évite les erreurs liées à `app-nav-bar`
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit charger les thèmes et les abonnements utilisateur au démarrage', () => {
    expect(topicServiceMock.getTopics).toHaveBeenCalled();
    expect(userServiceMock.getUserProfile).toHaveBeenCalled();
    expect(component.topics.length).toBe(2);
    expect(component.subscribedTopicsIds).toEqual([1]); // L'utilisateur est abonné à 'Tech'
  });

  it('doit afficher les thèmes correctement', () => {
    const topicElements = fixture.debugElement.queryAll(By.css('.card-title'));
    expect(topicElements.length).toBe(2);
    expect(topicElements[0].nativeElement.textContent).toContain('Tech');
    expect(topicElements[1].nativeElement.textContent).toContain('Gaming');
  });

  it('doit détecter si un utilisateur est abonné à un thème', () => {
    expect(component.isSubscribed(1)).toBe(true); // Déjà abonné à 'Tech'
    expect(component.isSubscribed(2)).toBe(false); // Pas abonné à 'Gaming'
  });

  it('doit s’abonner à un thème et rafraîchir les abonnements', async () => {
    component.subscribeToTopic(2); // S'abonne à 'Gaming'

    await fixture.whenStable(); // Attend l'update async

    expect(subscriptionServiceMock.subscribe).toHaveBeenCalledWith(2);
    expect(userServiceMock.getUserProfile).toHaveBeenCalledTimes(2); // Appel initial + après abonnement
  });

  it('doit afficher une erreur si l’abonnement échoue', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    subscriptionServiceMock.subscribe.mockReturnValue(throwError(() => new Error('Échec abonnement')));

    component.subscribeToTopic(2);

    await fixture.whenStable(); // Attend que l’erreur soit levée

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore(); // Nettoie le mock
  });
});
