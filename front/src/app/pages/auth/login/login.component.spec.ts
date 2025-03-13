import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let sessionServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };

    sessionServiceMock = {
      logIn: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore les erreurs de composants inconnus
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Mock de console.error pour éviter les erreurs Jest
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le formulaire de connexion', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('doit mettre à jour le modèle lors de la saisie des champs', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.loginRequest.email).toBe('test@example.com');
    expect(component.loginRequest.password).toBe('password123');
  });

  it('doit appeler le service AuthService et rediriger en cas de succès', () => {
    const fakeResponse = { token: 'fake-token', user: { id: 1, email: 'test@example.com' } };
    authServiceMock.login.mockReturnValue(of(fakeResponse));

    component.loginRequest.email = 'test@example.com';
    component.loginRequest.password = 'password123';

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(fakeResponse.user);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/topics']);
  });

  it('doit gérer une erreur de connexion et afficher un message d\'erreur', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Erreur de connexion')));

    component.loginRequest.email = 'test@example.com';
    component.loginRequest.password = 'wrongpassword';

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(console.error).toHaveBeenCalled(); // Vérifie que console.error a bien été appelé
  });
});
