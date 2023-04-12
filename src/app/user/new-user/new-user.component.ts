import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { ImageService } from '@imageService';
import { User } from '@user';
import { UserService } from '@userService';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorMatcher } from 'src/app/util/error-matcher';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  matcher = new ErrorMatcher();

  user: User;
  firstNameControl = new FormControl();
  lastNameControl = new FormControl();
  nameGroup = new FormBuilder().group({
    firstNameControl: this.firstNameControl,
    lastNameControl: this.lastNameControl,
  });
  themeControl = new FormControl();
  userImage: string;
  userImageProgress;

  constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.firstNameControl.patchValue(user.firstName);
      this.lastNameControl.patchValue(user.lastName);
      this.themeControl.patchValue(user.theme);

      this.imageService.download(user).then(url => {
        if (url) {
          this.userImage = url;
        }
      }, () => {});
    });
  }

  updateImage = (hasImage: boolean): void => {
    this.user.hasImage = hasImage;
    this.userService.update(this.user.getObject(), this.user.getId());
    this.currentUserService.setCurrentUser(this.user);
  };

  markAsTouched(): void {
    this.firstNameControl.markAsTouched();
    this.lastNameControl.markAsTouched();
  }

  submit(): void {
    let hasChange = false;

    if (this.user.firstName !== this.firstNameControl.value) {
      this.user.firstName = this.firstNameControl.value;
      hasChange = true;
    }
    if (this.user.lastName !== this.lastNameControl.value) {
      this.user.lastName = this.lastNameControl.value;
      hasChange = true;
    }
    if (this.user.theme !== this.themeControl.value) {
      this.user.theme = this.themeControl.value;
      hasChange = true;
    }

    if (hasChange) {
      this.userService.update(this.user.getObject(), this.user.getId());
      this.currentUserService.setCurrentUser(this.user);
    }
  }
}
