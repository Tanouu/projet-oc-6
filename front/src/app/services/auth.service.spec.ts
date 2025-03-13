import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../model/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Simule les appels HTTP
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Vérifie qu'il n'y a pas de requêtes non gérées
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête de login et stocker le token', () => {
    const loginData = { email: 'test@example.com', password: 'password' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);  // Simule une réponse API
  });

  it('devrait envoyer une requête de register et stocker le token', () => {
    const registerData = { email: 'new@example.com', password: 'password' };
    const mockResponse = { token: 'new-fake-jwt-token' };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('devrait récupérer les infos de l’utilisateur', () => {
    const mockUser: User = { id: 1, email: 'test@example.com', name: 'Test User' };

    service.me().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

});
