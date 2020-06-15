import { TestBed } from '@angular/core/testing';

import { ActionService } from 'src/app/profile/shared/action.service';

describe('ActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionService = TestBed.inject(ActionService);
    expect(service).toBeTruthy();
  });
});
