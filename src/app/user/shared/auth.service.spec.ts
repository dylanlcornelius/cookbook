import { ActionService } from '@actionService';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let firebase: FirebaseService;
  let currentUserService: CurrentUserService;
  let userService: UserService;
  let actionService: ActionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
    });
    service = TestBed.inject(AuthService);
    firebase = TestBed.inject(FirebaseService);
    currentUserService = TestBed.inject(CurrentUserService);
    userService = TestBed.inject(UserService);
    actionService = TestBed.inject(ActionService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should setup auth state watcher', () => {
      firebase.appLoaded = true;

      spyOn(firebase, 'onAuthStateChanged');

      service.load();

      expect(firebase.onAuthStateChanged).toHaveBeenCalled();
    });

    it('should not setup auth state watcher', () => {
      spyOn(firebase, 'onAuthStateChanged');

      service.load();

      expect(firebase.onAuthStateChanged).not.toHaveBeenCalled();
    });
  });

  describe('handleLogin', () => {
    it('should handle logging out a user', () => {
      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'getByUser').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(router, 'navigate');

      service.handleUserChange(undefined);

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.getByUser).not.toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).not.toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).not.toHaveBeenCalled();
      expect(actionService.commitAction).not.toHaveBeenCalled();
      expect(firebase.logEvent).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle logging in an existing user', () => {
      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'getByUser').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.getByUser).toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should handle logging in an existing user with a redirect url', () => {
      service.redirectUrl = 'url';

      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'getByUser').and.returnValue(of(new User({})));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.getByUser).toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should handle logging in a new user', () => {
      service.redirectUrl = 'url';

      spyOn(currentUserService, 'setIsGuest');
      spyOn(userService, 'getByUser').and.returnValue(of(undefined));
      spyOn(userService, 'create');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(currentUserService, 'setIsLoggedIn');
      spyOn(actionService, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(router, 'navigate');

      service.handleUserChange({ uid: 'uid' });

      expect(currentUserService.setIsGuest).toHaveBeenCalled();
      expect(userService.getByUser).toHaveBeenCalled();
      expect(userService.create).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(currentUserService.setIsLoggedIn).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('googleLogin', () => {
    it('should sign in with a redirect', () => {
      spyOn(firebase, 'signInWithPopup');

      service.googleLogin();

      expect(firebase.signInWithPopup).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should sign out', fakeAsync(() => {
      const router = TestBed.inject(Router);

      spyOn(firebase, 'signOut').and.returnValue(Promise.resolve());
      spyOn(router, 'navigate');

      service.logout();

      tick();
      expect(firebase.signOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    }));

    it('should catch a sign out error', () => {
      spyOn(firebase, 'signOut').and.returnValue(Promise.reject({}));

      service.logout();

      expect(firebase.signOut).toHaveBeenCalled();
    });
  });
});
