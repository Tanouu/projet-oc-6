import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SessionService } from '../../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let sessionServiceMock: any;
  let isLoadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoadingSubject = new BehaviorSubject<boolean>(false); // ✅ Utilisation correcte du BehaviorSubject

    sessionServiceMock = {
      isLoading$: () => isLoadingSubject.asObservable() // ✅ Fournir une fonction qui retourne l'observable
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: SessionService, useValue: sessionServiceMock }],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ✅ Détection des changements initiale
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher "Chargement..." lorsque isLoading$ est true', async () => {
    isLoadingSubject.next(true); // ✅ Met à jour le BehaviorSubject
    fixture.detectChanges();
    await fixture.whenStable(); // ✅ Assure que tout est bien mis à jour

    console.log(fixture.nativeElement.innerHTML); // 🔥 DEBUG : voir le HTML rendu

    const loadingText = fixture.debugElement.query(By.css('p'));
    expect(loadingText).toBeTruthy();
    expect(loadingText.nativeElement.textContent.trim()).toBe('Chargement...');
  });

  it('doit afficher le contenu principal lorsque isLoading$ est false', async () => {
    isLoadingSubject.next(false); // ✅ Mise à jour du BehaviorSubject
    fixture.detectChanges();
    await fixture.whenStable(); // ✅ Attente de la mise à jour Angular

    const logo = fixture.debugElement.query(By.css('img[alt="logo"]'));
    const loginButton = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    const registerButton = fixture.debugElement.query(By.css('button[routerLink="/register"]'));

    expect(logo).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(registerButton).toBeTruthy();
  });

  it('doit contenir un bouton "Se connecter" et un bouton "S\'inscrire"', async () => {
    isLoadingSubject.next(false); // ✅ Mise à jour du BehaviorSubject
    fixture.detectChanges();
    await fixture.whenStable(); // ✅ Pour éviter les erreurs liées au DOM non mis à jour

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Se connecter');
    expect(buttons[1].nativeElement.textContent.trim()).toBe("S'inscrire");
  });
});
