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
  setCurrentUser(currentUser: User): void { this.currentUser.next(currentUser); }

  getIsLoggedIn(): Observable<boolean> { return this.isloggedIn.asObservable(); }
  setIsLoggedIn(isloggedIn: boolean): void { this.isloggedIn.next(isloggedIn); }

  getIsGuest(): Observable<boolean> { return this.isGuest.asObservable(); }
  setIsGuest(isGuest: boolean): void { this.isGuest.next(isGuest); }
}
