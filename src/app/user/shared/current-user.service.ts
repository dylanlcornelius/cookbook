import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUser = new BehaviorSubject<User>(new User({}));
  private isloggedIn = new BehaviorSubject<boolean>(false);
  private isGuest = new BehaviorSubject<boolean>(false);

  getCurrentUser(): Observable<User> { return this.currentUser.asObservable(); }
  setCurrentUser(currentUser: User) { this.currentUser.next(currentUser); }

  getIsLoggedIn() { return this.isloggedIn.asObservable(); }
  setIsLoggedIn(isloggedIn: boolean) { this.isloggedIn.next(isloggedIn); }

  getIsGuest() { return this.isGuest.asObservable(); }
  setIsGuest(isGuest: boolean) { this.isGuest.next(isGuest); }
}
