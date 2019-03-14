import { TestBed } from '@angular/core/testing';

import { UserActionService } from './user-action.service';

describe('UserActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserActionService = TestBed.get(UserActionService);
    expect(service).toBeTruthy();
  });
});
