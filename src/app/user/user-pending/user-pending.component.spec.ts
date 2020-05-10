import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { UserService } from '@userService';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user.model';
import { HomeComponent } from 'src/app/home/home.component';

import { UserPendingComponent } from './user-pending.component';

describe('UserPendingComponent', () => {
  let component: UserPendingComponent;
  let fixture: ComponentFixture<UserPendingComponent>;
  let userService: UserService
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'home', component: HomeComponent}
        ])
      ],
      declarations: [ UserPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {});

  it('should create', () => {
    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not redirect a pending user', () => {
    let userService = TestBed.inject(UserService);

    spyOn(userService, 'getCurrentUser').and.returnValue(of(new User({role: 'admin'})));

    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(userService.getCurrentUser).toHaveBeenCalled();
  });

  describe('signOut', () => {
    it('should log out', () => {
      fixture = TestBed.createComponent(UserPendingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      let authService = TestBed.inject(AuthService);

      spyOn(authService, 'logout');

      component.signOut();

      expect(authService.logout);
    });
  });
});
