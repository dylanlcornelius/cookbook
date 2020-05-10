import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthService } from '../user/shared/auth.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleNav', () => {
    it('should invert the nav boolean', () => {
      component.toggleNav();

      expect(component.showNav).toBeTruthy();
    });
  });

  describe('signOut', () => {
    it('should logout', () => {
      spyOn(authService, 'logout');

      component.signOut();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
