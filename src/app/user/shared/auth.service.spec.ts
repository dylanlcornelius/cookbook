import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterModule.forRoot([])
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });
});
