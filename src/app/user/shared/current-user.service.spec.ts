import { TestBed } from '@angular/core/testing';
import { User } from '@user';

import { CurrentUserService } from './current-user.service';

describe('CurrentUserService', () => {
  let service: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentUser', () => {
    it('should get the current user', () => {
      service.getCurrentUser().subscribe(result => {
        expect(result).toBeDefined();
      });
    });
  });

  describe('setCurrentUser', () => {
    it('should set the current user', () => {
      service.setCurrentUser(new User({ id: 'id' }));

      service.getCurrentUser().subscribe(result => {
        expect(result.id).toEqual('id');
      });
    });
  });

  describe('getIsLoggedIn', () => {
    it('should get whether there is a user logged in', () => {
      service.getIsLoggedIn().subscribe(result => {
        expect(result).toBeFalse();
      });
    });
  });

  describe('setIsLoggedIn', () => {
    it('should set whether there is a user logged in', () => {
      service.setIsLoggedIn(true);

      service.getIsLoggedIn().subscribe(result => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('getIsGuest', () => {
    it('should get whether the user is a guest', () => {
      service.getIsGuest().subscribe(result => {
        expect(result).toBeFalse();
      });
    });
  });

  describe('setIsGuest', () => {
    it('should set whether the user is a guest', () => {
      service.setIsGuest(true);

      service.getIsGuest().subscribe(result => {
        expect(result).toEqual(true);
      });
    });
  });
});
