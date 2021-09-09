import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { UserPendingGuard } from './user-pending.guard';

describe('UserPendingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [UserPendingGuard]
    });
  });

  it('should ...', inject([UserPendingGuard], (guard: UserPendingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
