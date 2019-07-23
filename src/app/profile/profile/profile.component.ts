import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ErrorStateMatcher } from '@angular/material';
import { UserService } from '../../user/user.service';
import { User } from 'src/app/user/user.model';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading: Boolean = true;
  notificationModalParams;

  userForm: FormGroup;
  uid: string;
  id: string;

  matcher = new ErrorMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    // TODO: make uid global
    this.uid = this.cookieService.get('LoggedIn');
    this.initializeUserForm();
  }

  initializeUserForm() {
    this.loading = true;

    this.userService.getUser(this.uid).subscribe((user: User) => {
      this.userForm = this.formBuilder.group({
        uid: [this.uid],
        firstName : [user.firstName, Validators.required],
        lastName : [user.lastName, Validators.required],
        role: [user.role],
        theme: [user.theme],
        id: [user.id]
      });

      this.loading = false;
    });
  }

  onFormSubmit(form) {
    const user = new User(
      form.uid,
      form.firstName,
      form.lastName,
      form.role,
      form.theme,
      form.id
    );

    this.userService.putUser(user).subscribe(() => {
      this.userService.setCurrentUser(user);

      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Profile Information Updated!'
      };

      this.initializeUserForm();
    }, (err) => {
      console.error(err);

      this.initializeUserForm();
    });
  }
}
