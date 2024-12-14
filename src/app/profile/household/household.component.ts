import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from '@firebaseService';
import { Household } from '@household';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User, Users } from '@user';
import { UserService } from '@userService';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HouseholdInviteModalParams } from 'src/app/profile/household-invite-modal/household-invite-modal.component';

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styleUrls: ['./household.component.scss'],
})
export class HouseholdComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;

  user: User;
  household: Household;

  householdInvitesDataSource: MatTableDataSource<Household['invites'][0]>;
  householdMembersDataSource: MatTableDataSource<Household['members'][0]>;
  myInvitesDataSource: MatTableDataSource<Household>;
  filteredUsers: Users;

  householdInviteModalParams: HouseholdInviteModalParams;

  @Input()
  userId: string;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private householdService: HouseholdService,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private firebase: FirebaseService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.loading = this.loadingService.set(true);

    this.userService
      .getByUser(this.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user!;

        const users$ = this.userService.getAll();
        const household$ = this.householdService.getByUser(this.user.uid);
        const invites$ = this.householdService.getInvites(this.user.uid);

        combineLatest([users$, household$, invites$])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(([users, household, invites]) => {
            this.household = this.initializeHouseholdNames(household, users);
            this.householdInvitesDataSource = new MatTableDataSource(this.household.invites);
            this.householdMembersDataSource = new MatTableDataSource(this.household.members);

            this.filteredUsers = users.filter(({ uid }) => {
              return (
                !this.household?.memberIds.some((memberUid) => uid === memberUid) &&
                !this.household?.inviteIds.some((inviteId) => uid === inviteId)
              );
            });

            this.myInvitesDataSource = new MatTableDataSource(
              invites.map((invite) => this.initializeHouseholdNames(invite, users))
            );
            this.loading = this.loadingService.set(false);
          });
      });
  }

  initializeHouseholdNames(household: Household, users: Users): Household {
    household.members.forEach((member) => {
      const user = users.find(({ uid }) => uid === member.uid);
      member.name = user?.name || '';
    });

    household.invites.forEach((invite) => {
      const user = users.find(({ uid }) => uid === invite.uid);
      invite.name = user?.name || '';

      const inviterUser = users.find(({ uid }) => uid === invite.inviter);
      invite.inviterName = inviterUser?.name || '';
    });

    return household;
  }

  cleanHousehold(userUid: string, household?: Household): void {
    if (household) {
      household.members = household.members.filter(({ uid }) => uid !== userUid);
      household.memberIds = household.memberIds.filter((uid) => uid !== userUid);

      if (household.memberIds.length) {
        this.householdService.update(household.getObject(), household.getId());
      } else {
        this.householdService.delete(household.getId());
      }
    }
  }

  createHousehold(): void {
    if (this.household) {
      this.validationService.setModal({
        text: 'Are you sure you want to leave your current household and create a new one?',
        function: this.createHouseholdEvent,
      });
    } else {
      this.createHouseholdEvent();
    }
  }

  createHouseholdEvent = (): void => {
    this.cleanHousehold(this.user.uid, this.household);
    this.householdService.create(
      new Household({
        name: 'My Household',
        members: [{ uid: this.user.uid }],
        memberIds: [this.user.uid],
      })
    );
    this.notificationService.setModal(new SuccessNotification('Household created!'));
  };

  sendInvite(): void {
    this.householdInviteModalParams = {
      function: this.sendInviteEvent,
      users: this.filteredUsers,
    };
  }

  sendInviteEvent = (user?: User): void => {
    if (user && user.uid && this.household) {
      this.household.invites.push({ uid: user.uid, inviter: this.user.uid });
      this.household.inviteIds.push(user.uid);
      this.householdService.update(this.household.getObject(), this.household.getId());
      this.notificationService.setModal(new SuccessNotification('Household invitation sent!'));
    }
  };

  removeMember(member: Household['members'][0]): void {
    this.validationService.setModal({
      text: 'Are you sure you want to remove this household member?',
      function: this.removeMemberEvent,
      args: [member],
    });
  }

  removeMemberEvent = (member: Household['members'][0]): void => {
    this.cleanHousehold(member.uid, this.household);
    this.notificationService.setModal(new SuccessNotification('Household member removed'));
  };

  getInviterName(household: Household): string {
    return household.invites.find(({ uid }) => uid === this.user.uid)?.inviterName || '';
  }

  rejectInvite(household: Household): void {
    household.invites = household.invites.filter(({ uid }) => uid !== this.user.uid);
    household.inviteIds = household.inviteIds.filter((uid) => uid !== this.user.uid);
    this.householdService.update(household.getObject(), household.getId());
    this.notificationService.setModal(new SuccessNotification('Invitation rejected'));
  }

  acceptInvite(household: Household): void {
    if (this.household) {
      this.validationService.setModal({
        text: 'Are you sure you want to leave your current household and join a new one?',
        function: this.acceptInviteEvent,
        args: [household],
      });
    } else {
      this.acceptInviteEvent(household);
    }
  }

  acceptInviteEvent = (household: Household): void => {
    this.cleanHousehold(this.user.uid, this.household);

    household.members.push({ uid: this.user.uid });
    household.memberIds.push(this.user.uid);
    household.invites = household.invites.filter(({ uid }) => uid !== this.user.uid);
    household.inviteIds = household.inviteIds.filter((uid) => uid !== this.user.uid);
    this.householdService.update(household.getObject(), household.getId());
    this.notificationService.setModal(new SuccessNotification('Invitation accepted'));
    this.firebase.logEvent('join_group', { group_id: household.id, group_name: household.name });
  };
}
