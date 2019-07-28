import { TestBed } from '@angular/core/testing';

import { UserItemService } from './user-item.service';

describe('UserItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserItemService = TestBed.get(UserItemService);
    expect(service).toBeTruthy();
  });
});
