import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { of } from 'rxjs';
import { LoginComponent } from '../login/login.component';

import { LoginGuard } from './login.guard';

describe('LoggedInGuard', () => {
  let currentUserService: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'login', component: LoginComponent }
        ])
      ],
      providers: [LoginGuard]
    });

    currentUserService = TestBed.inject(CurrentUserService);
  });

  it('should activate when logged in', inject([LoginGuard], (guard: LoginGuard) => {
    spyOn(currentUserService, 'getIsLoggedIn').and.returnValue(of(true));

    guard.canActivateChild(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'url' }).subscribe(result => {
      expect(result).toBeTrue();
    });
  }));

  it('should not activate when not logged in', inject([LoginGuard], (guard: LoginGuard) => {
    guard.pageLoad = 'redirect';

    spyOn(currentUserService, 'getIsLoggedIn').and.returnValue(of(false));

    guard.canActivateChild(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'url' }).subscribe(result => {
      expect(result).toBeFalse();
    });
  }));

  it('should not activate when not logged in and store a redirect url', inject([LoginGuard], (guard: LoginGuard) => {
    spyOn(currentUserService, 'getIsLoggedIn').and.returnValue(of(false));

    guard.canActivateChild(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'url' }).subscribe(result => {
      expect(result).toBeFalse();
      expect(guard.pageLoad).toEqual('url');
    });
  }));
});
