import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { SubscriptionService } from '../../services/subscription.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceMock: any;
  let subscriptionServiceMock: any;
  let sessionServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getUserProfile: jest.fn().mockReturnValue(of({
        id: 1,
        name: 'TestUser',
        email: 'test@example.com',
        subscriptions: [{ id: 1, name: 'Tech', description: 'Tech News' }]
      })),
      updateProfile: jest.fn().mockReturnValue(of({
        id: 1,
        name: 'UpdatedUser',
        email: 'updated@example.com',
        subscriptions: []
      }))
    };

    subscriptionServiceMock = {
      unsubscribe: jest.fn().mockReturnValue(of({}))
    };

    sessionServiceMock = {
      logIn: jest.fn(),
      logOut: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SubscriptionService, useValue: subscriptionServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Ignore les erreurs liées à `<app-nav-bar>`
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔄 Déclenche `ngOnInit()`
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit charger le profil utilisateur au démarrage', () => {
    expect(userServiceMock.getUserProfile).toHaveBeenCalled();
    expect(component.userProfile?.name).toBe('TestUser');
    expect(component.userUpdate.name).toBe('TestUser');
  });

  it('doit afficher les abonnements', () => {
    fixture.detectChanges();
    const subscriptions = fixture.debugElement.queryAll(By.css('.card-title'));
    expect(subscriptions.length).toBe(1);
    expect(subscriptions[0].nativeElement.textContent.trim()).toBe('Tech');
  });

  it('doit mettre à jour le profil utilisateur', () => {
    component.userUpdate.name = 'UpdatedUser';
    component.userUpdate.email = 'updated@example.com';
    component.saveProfile();

    expect(userServiceMock.updateProfile).toHaveBeenCalledWith({
      name: 'UpdatedUser',
      email: 'updated@example.com',
      password: ''
    });

    expect(sessionServiceMock.logIn).toHaveBeenCalled();
    expect(component.userProfile?.name).toBe('UpdatedUser');
  });

  it('doit afficher une erreur en cas d’échec de mise à jour', () => {
    console.error = jest.fn();
    userServiceMock.updateProfile.mockReturnValue(throwError(() => new Error('Erreur mise à jour')));

    component.saveProfile();

    expect(console.error).toHaveBeenCalledWith('Erreur mise à jour profil', expect.any(Error));
    expect(component.isUpdating).toBe(false);
  });

  it('doit désabonner un utilisateur d’un sujet', () => {
    component.userProfile = {
      id: 1,
      name: 'TestUser',
      email: 'test@example.com',
      subscriptions: [{ id: 1, name: 'Tech', description: 'Tech News' }]
    };

    component.unsubscribe(1);

    expect(subscriptionServiceMock.unsubscribe).toHaveBeenCalledWith(1);
    expect(component.userProfile.subscriptions.length).toBe(0);
  });

  it('doit afficher une erreur en cas d’échec de désabonnement', () => {
    console.error = jest.fn();
    subscriptionServiceMock.unsubscribe.mockReturnValue(throwError(() => new Error('Erreur de désabonnement')));

    component.unsubscribe(1);

    expect(console.error).toHaveBeenCalled();
  });

  it('doit déconnecter l’utilisateur et rediriger', () => {
    component.logout();
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
