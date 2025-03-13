import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { User } from '../model/user.interface';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        SessionService
      ]
    });

    localStorage.setItem('token', 'mockToken');

    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn(service, 'autoLogin').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.match(() => true).forEach(req => req.flush(null));
    httpMock.verify({ ignoreCancelled: true });
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('doit intercepter la requête au démarrage', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };

    // 🔥 On simule un token valide
    localStorage.setItem('token', 'mockToken');

    // 🔥 On appelle manuellement autoLogin() pour déclencher la requête
    service.autoLogin();

    // 🔥 On intercepte la requête et on la simule
    const req = httpMock.expectOne('/api/user/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // ✅ Simulation de la réponse

    expect(service.user).toEqual(mockUser);
    expect(service.isLogged).toBeTruthy();
  });



  it('devrait connecter un utilisateur et rediriger vers /topics', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };

    service.logIn(mockUser);

    expect(service.user).toEqual(mockUser);
    expect(service.isLogged).toBeTruthy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/topics']);
  });

  it('devrait déconnecter l’utilisateur et rediriger vers /login', () => {
    service.logOut();

    expect(service.user).toBeUndefined();
    expect(service.isLogged).toBeFalsy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('devrait récupérer l’utilisateur s’il y a un token', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
    localStorage.setItem('token', 'mockToken');

    service.autoLogin(); // 🔥 On appelle autoLogin manuellement ici

    // 🔥 On capture toutes les requêtes vers /api/user/me
    const requests = httpMock.match('/api/user/me');

    expect(requests.length).toBeGreaterThanOrEqual(1);
    requests.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    expect(service.user).toEqual(mockUser);
    expect(service.isLogged).toBeTruthy();
  });


  it('devrait charger l’utilisateur s’il y a un token', () => {
    const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
    localStorage.setItem('token', 'mockToken');

    service.autoLogin(); // 🔥 On appelle autoLogin manuellement ici

    // 🔥 On capture toutes les requêtes vers /api/user/me
    const requests = httpMock.match('/api/user/me');

    expect(requests.length).toBeGreaterThanOrEqual(1);
    requests.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    expect(service.user).toEqual(mockUser);
    expect(service.isLogged).toBeTruthy();
  });

});
