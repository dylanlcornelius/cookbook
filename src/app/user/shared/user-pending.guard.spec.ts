import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { ROLE, User } from '@user';
import { of } from 'rxjs';
import { UserPendingComponent } from '../user-pending/user-pending.component';

import { UserPendingGuard } from './user-pending.guard';

describe('UserPendingGuard', () => {
  let currentUserService: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'user-pending', component: UserPendingComponent }
        ])
      ],
      providers: [UserPendingGuard]
    });

    currentUserService = TestBed.inject(CurrentUserService);
  });

  it('should not activate for non-pending users', inject([UserPendingGuard], (guard: UserPendingGuard) => {
    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ role: ROLE.ADMIN })));

    guard.canActivateChild().subscribe(result => {
      expect(result).toBeTrue();
    });
  }));

  it('should active when the user is pending', inject([UserPendingGuard], (guard: UserPendingGuard) => {
    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ role: ROLE.PENDING })));

    guard.canActivateChild().subscribe(result => {
      expect(result).toBeFalse();
    });
  }));
});
