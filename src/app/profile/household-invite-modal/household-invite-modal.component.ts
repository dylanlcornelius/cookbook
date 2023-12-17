/*
** DROP THIS IN HTML **
<app-household-invite-modal [Params]="householdInviteModalParams"></app-household-invite-modal>

** DROP THIS IN TYPESCRIPT **
householdInviteModalParams;

this.householdInviteModalParams = {
  function: this.sendInviteEvent,
  users: this.filteredUsers,
};
*/

import { Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User, Users } from '@user';
import { ModalComponent } from '@modalComponent';

@Component({
  selector: 'app-household-invite-modal',
  templateUrl: './household-invite-modal.component.html',
  styleUrls: ['./household-invite-modal.component.scss'],
})
export class HouseholdInviteModalComponent {
  inviteSearchControl = new FormControl();

  params;

  @Input()
  set Params(params: { function: Function; users: Users }) {
    this.inviteSearchControl = new FormControl();
    this.params = params;
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor() {}

  displayFn(user: User): string {
    return user?.name;
  }

  cancel(): void {
    this.modal.close();
  }

  confirm(): void {
    this.params.function(this.inviteSearchControl.value);
    this.modal.close();
  }
}
