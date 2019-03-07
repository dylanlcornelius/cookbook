import { TestBed, async, inject } from '@angular/core/testing';

import { UserPendingGuard } from './user-pending.guard';

describe('UserPendingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPendingGuard]
    });
  });

  it('should ...', inject([UserPendingGuard], (guard: UserPendingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
