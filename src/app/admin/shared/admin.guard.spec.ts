import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { of } from 'rxjs';

import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let currentUserService: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [AdminGuard]
    });

    currentUserService = TestBed.inject(CurrentUserService);
  });

  it('should not activate for non-admin users', inject([AdminGuard], (guard: AdminGuard) => {
    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ role: 'pending' })));

    guard.canActivateChild().subscribe(result => {
      expect(result).toBeFalse();
    });
  }));

  it('should active when the user is an admin', inject([AdminGuard], (guard: AdminGuard) => {
    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ role: 'admin' })));

    guard.canActivateChild().subscribe(result => {
      expect(result).toBeTrue();
    });
  }));
});
