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
import { ActionService } from '../action.service';
import { ActionLabel, ActionColor } from '../action.enum';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loading: Boolean = true;
  notificationModalParams;

  userForm: FormGroup;
  uid: string;
  id: string;

  actions = {};
  actionsLength = 0;
  week = {pageIndex: 0};

  monthActions = {};
  monthActionsLength = 0;
  month = {pageIndex: 0};

  // totalActionsLabels = [];
  // totalActionsData = [{data: [], label: '', backgroundColor: ''}];
  // totalActionsLabels = [
  //   'Login',
  //   'Create Recipe',
  //   'Update Recipe',
  //   'Delete Recipe',
  //   'Create Ingredient',
  //   'Update Ingredient',
  //   'Delete Ingredient',
  //   'Create Item',
  //   'Update Item',
  //   'Delete Item',
  //   'Buy Ingredient',
  //   'Complete Shopping List',
  // ];
  // // totalActionsData = [{data: [], label: '', backgroundColor: ''}];
  // totalActionsData = [{data: [], label: '', backgroundColor: ''}];
  // totalActionsColors = [
  //   '#CCCCCC',
  //   '#9ef533',
  //   '#de33f5',
  //   '#f73434',
  //   '#57f533',
  //   '#f533d5',
  //   '#f76f34',
  //   '#33f57a',
  //   '#f53397',
  //   '#f7a634',
  //   '#3394f5',
  //   '#5733f5',
  // ];

  matcher = new ErrorMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private userService: UserService,
    private actionService: ActionService
  ) { }

  ngOnInit() {
    // TODO: make uid global; handle loggedIn cookie in userService
    this.uid = this.cookieService.get('LoggedIn');
    this.initializeUserForm();

    this.actionService.getActions(this.uid).then((userAction) => {
      console.log(userAction);

      const actions = {};
      // Object.keys(userAction.actions).forEach(a => {
      //   Object.keys(actions).forEach(action => {
      //     if (action.split('/')[1] < a.split('/')[1]) {

      //     }
      //   });
      // });

      let i = 0;
      Object.keys(userAction.actions).forEach(action => {
        const actionLabels = [];
        // const actionData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const actionData = [];
        const actionColors = [];

        Object.keys(userAction.actions[action]).forEach(actionKey => {
          // actionLabels.push(actionKey);
          actionLabels.push(ActionLabel[actionKey]);
          // actionData[this.totalActionsLabels.indexOf(ActionLabel[actionKey])] = userAction.actions[action][actionKey];
          actionData.push(userAction.actions[action][actionKey]);
          actionColors.push(ActionColor[actionKey]);
          // actionColors.push(this.stringToColor(actionKey));

          // if (this.totalActionsLabels.indexOf(actionKey) === -1) {
          //   this.totalActionsLabels.push(actionKey);
          // }
        });

        this.actions[i] = {
          labels: actionLabels,
          data: actionData,
          colors: [{ backgroundColor: actionColors }],
          date: action,
        };

        console.log(actionData, action);
        // if (i === 0) {
        //   this.totalActionsData = [{
        //     data: actionData,
        //     label: action,
        //     backgroundColor: this.totalActionsColors[i]
        //   }];
        // } else {
        //   this.totalActionsData.push({
        //     data: actionData,
        //     label: action,
        //     backgroundColor: this.totalActionsColors[i]
        //   });
        // }

        i++;
      });
      this.actionsLength = Object.keys(userAction.actions).length;

      // console.log(this.totalActionsData);
      // console.log(this.totalActionsLabels);

      console.log(this.actions);
    });
  }

  initializeUserForm() {
    this.loading = true;

    this.userService.getUser(this.uid).subscribe((user: User) => {
      this.userForm = this.formBuilder.group({
        uid: [this.uid],
        firstName : [user.firstName, Validators.required],
        lastName : [user.lastName, Validators.required],
        role: [user.role],
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
      form.id
    );

    this.userService.putUser(user).subscribe(() => {
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
