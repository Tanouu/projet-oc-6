import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let sessionServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    };

    sessionServiceMock = {
      logIn: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le formulaire d\'inscription', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(nameInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('doit mettre à jour le modèle lors de la saisie des champs', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    nameInput.value = 'John Doe';
    nameInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.registerRequest.email).toBe('test@example.com');
    expect(component.registerRequest.password).toBe('password123');
    expect(component.registerRequest.name).toBe('John Doe');
  });

  it('doit appeler le service AuthService et rediriger en cas de succès', () => {
    const fakeResponse = { token: 'fake-token', user: { id: 1, email: 'test@example.com' } };
    authServiceMock.register.mockReturnValue(of(fakeResponse));

    component.registerRequest.email = 'test@example.com';
    component.registerRequest.password = 'password123';
    component.registerRequest.name = 'John Doe';

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe'
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(fakeResponse.user);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/topics']);
  });

  it('doit gérer une erreur d\'inscription et afficher un message d\'erreur', () => {
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Erreur d\'inscription')));

    component.registerRequest.email = 'test@example.com';
    component.registerRequest.password = 'wrongpassword';
    component.registerRequest.name = 'John Doe';

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Évite d'afficher l'erreur dans la console pendant le test

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword',
      name: 'John Doe'
    });

    expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'inscription', expect.any(Error));
  });
});
