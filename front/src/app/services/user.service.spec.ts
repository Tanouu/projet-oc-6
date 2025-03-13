import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserProfile } from '../model/user-profile';
import { UserUpdate } from '../model/user-update';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait récupérer le profil utilisateur', () => {
    const mockProfile: UserProfile = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      subscriptions: [{ id: 1, name: 'Angular', description: 'Framework front-end' }]
    };

    service.getUserProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne('/api/user/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('devrait mettre à jour le profil utilisateur', () => {
    const userUpdate: UserUpdate = { name: 'John Updated', email: 'john.updated@example.com' };
    const updatedProfile: UserProfile = {
      id: 1,
      name: 'John Updated',
      email: 'john.updated@example.com',
      subscriptions: []
    };

    service.updateProfile(userUpdate).subscribe(profile => {
      expect(profile).toEqual(updatedProfile);
    });

    const req = httpMock.expectOne('/api/user/me');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(userUpdate);
    req.flush(updatedProfile);
  });

});
