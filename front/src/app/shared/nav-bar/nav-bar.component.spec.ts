import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import {BehaviorSubject, of} from 'rxjs';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let routerMock: any;
  let sessionServiceMock: any;
  let isLoggedSubject = new BehaviorSubject<boolean>(true);

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
      url: '/posts',
    };

    sessionServiceMock = {
      isLogged$: jest.fn(() => isLoggedSubject.asObservable()),
    };


    await TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher la barre de navigation pour un utilisateur connecté', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const navbar = fixture.debugElement.query(By.css('nav'));
    expect(navbar).toBeTruthy();
  });

  it('devrait appliquer la classe active sur les liens', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    console.log(fixture.nativeElement.innerHTML);

    const postLinkDebug = fixture.debugElement.query(By.css('a[routerLink="/posts"]'));

    expect(postLinkDebug).not.toBeNull();

    if (postLinkDebug) {
      const postLink = postLinkDebug.nativeElement;
      expect(postLink.classList).toContain('purple');
    }
  });

  it('devrait marquer le lien "/posts" comme actif après un clic', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const postLinkDebug = fixture.debugElement.query(By.css('a[routerLink="/posts"]'));
    expect(postLinkDebug).not.toBeNull();

    if (postLinkDebug) {
      postLinkDebug.triggerEventHandler('click', new Event('click'));
      fixture.detectChanges();

      expect(postLinkDebug.nativeElement.classList).toContain('purple');
    }
  });


  it('doit cacher la navbar si l\'utilisateur est déconnecté', async () => {
    isLoggedSubject.next(false); // 🔥 Mise à jour de l'état utilisateur

    fixture.detectChanges(); // 🔥 Forcer la mise à jour de l'UI
    await fixture.whenStable(); // 🔥 S'assurer que tout est bien appliqué
    fixture.detectChanges(); // 🔥 Deuxième mise à jour pour Angular

    console.log(fixture.nativeElement.innerHTML); // 🔍 Voir le DOM rendu après mise à jour

    // Vérifie que la navbar connectée n'est plus affichée
    const navbarConnected = fixture.debugElement.query(By.css('.d-none.d-md-flex'));
    expect(navbarConnected).toBeNull(); // ✅ Elle ne doit plus être présente

    // Vérifie que la navbar des invités est bien affichée
    const guestNavbar = fixture.debugElement.query(By.css('nav'));
    expect(guestNavbar).not.toBeNull(); // ✅ Elle doit être affichée
  });
});
