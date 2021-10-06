import { ActionService } from '@actionService';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import FirebaseAuth from 'firebase';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let currentUserService: CurrentUserService;
  let userService: UserService;
  let actionService: ActionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ]
    });
    service = TestBed.inject(AuthService);
    currentUserService = TestBed.inject(CurrentUserService);
    userService = TestBed.inject(UserService);
    actionService = TestBed.inject(ActionService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleLogin', () => {
    it('should handle logging out a user', () => {
      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'get').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(router, 'navigate');

      service.handleUserChange(undefined);

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.get).not.toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).not.toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).not.toHaveBeenCalled();
      expect(actionService.commitAction).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle logging in an existing user', () => {
      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'get').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should handle logging in an existing user with a redirect url', () => {
      service.redirectUrl = 'url';

      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'get').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should handle logging in a new user', () => {
      service.redirectUrl = 'url';

      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'get').and.returnValue(of(undefined));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(userService.create).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
