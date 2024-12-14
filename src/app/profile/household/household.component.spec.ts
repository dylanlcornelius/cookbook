import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseService } from '@firebaseService';
import { Household } from '@household';
import { HouseholdService } from '@householdService';
import { NotificationService, ValidationService } from '@modalService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';
import { HouseholdComponent } from './household.component';

describe('HouseholdComponent', () => {
  let component: HouseholdComponent;
  let fixture: ComponentFixture<HouseholdComponent>;
  let userService: UserService;
  let householdService: HouseholdService;
  let notificationService: NotificationService;
  let validationService: ValidationService;
  let firebase: FirebaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseholdComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    userService = TestBed.inject(UserService);
    householdService = TestBed.inject(HouseholdService);
    notificationService = TestBed.inject(NotificationService);
    validationService = TestBed.inject(ValidationService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load with a household', () => {
      const user = new User({});
      const users = [new User({ uid: 'uid' })];
      const household = new Household({ memberIds: ['uid2'], inviteIds: ['uid'] });
      const invites = [new Household({})];

      spyOn(userService, 'getByUser').and.returnValue(of(user));
      spyOn(userService, 'getAll').and.returnValue(of(users));
      spyOn(householdService, 'getByUser').and.returnValue(of(household));
      spyOn(householdService, 'getInvites').and.returnValue(of(invites));
      spyOn(component, 'initializeHouseholdNames').and.returnValue(household);

      component.load();

      expect(userService.getByUser).toHaveBeenCalled();
      expect(userService.getAll).toHaveBeenCalled();
      expect(householdService.getByUser).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
      expect(component.initializeHouseholdNames).toHaveBeenCalledTimes(2);
    });
  });

  describe('initializeHouseholdNames', () => {
    it('should add names to a household', () => {
      const household = new Household({
        members: [{ uid: 'uid' }, { uid: 'uid3' }],
        invites: [
          { uid: 'uid2', inviter: 'uid' },
          { uid: 'uid4', inviter: 'uid3' },
        ],
      });
      const users = [
        new User({ uid: 'uid', firstName: 'name' }),
        new User({ uid: 'uid2', firstName: 'name2' }),
      ];

      const result = component.initializeHouseholdNames(household, users);

      expect(result).toBeDefined();
    });
  });

  describe('cleanHousehold', () => {
    it('should update a household', () => {
      const household = new Household({ members: [{ uid: 'uid2' }], memberIds: ['uid2'] });
      const uid = 'uid';

      spyOn(householdService, 'update');
      spyOn(householdService, 'delete');

      component.cleanHousehold(uid, household);

      expect(householdService.update).toHaveBeenCalled();
      expect(householdService.delete).not.toHaveBeenCalled();
    });

    it('should delete a household', () => {
      const household = new Household({ memberIds: ['uid'] });
      const uid = 'uid';

      spyOn(householdService, 'update');
      spyOn(householdService, 'delete');

      component.cleanHousehold(uid, household);

      expect(householdService.update).not.toHaveBeenCalled();
      expect(householdService.delete).toHaveBeenCalled();
    });

    it('should do nothing without a valid household', () => {
      const household = undefined;
      const uid = 'uid';

      spyOn(householdService, 'update');
      spyOn(householdService, 'delete');

      component.cleanHousehold(uid, household);

      expect(householdService.update).not.toHaveBeenCalled();
      expect(householdService.delete).not.toHaveBeenCalled();
    });
  });

  describe('createHousehold', () => {
    it('should fire a validation modal', () => {
      component.household = new Household({});

      spyOn(validationService, 'setModal');
      spyOn(component, 'createHouseholdEvent');

      component.createHousehold();

      expect(validationService.setModal).toHaveBeenCalled();
      expect(component.createHouseholdEvent).not.toHaveBeenCalled();
    });

    it('should fire an event', () => {
      spyOn(validationService, 'setModal');
      spyOn(component, 'createHouseholdEvent');

      component.createHousehold();

      expect(validationService.setModal).not.toHaveBeenCalled();
      expect(component.createHouseholdEvent).toHaveBeenCalled();
    });
  });

  describe('createHouseholdEvent', () => {
    it('should make a new household', () => {
      component.user = new User({});

      spyOn(component, 'cleanHousehold');
      spyOn(householdService, 'create');
      spyOn(notificationService, 'setModal');

      component.createHouseholdEvent();

      expect(component.cleanHousehold).toHaveBeenCalled();
      expect(householdService.create).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('sendInvite', () => {
    it('should update a household with an invitation', () => {
      component.sendInvite();

      expect(component.householdInviteModalParams).toBeDefined();
    });
  });

  describe('sendInviteEvent', () => {
    it('should update a household with an invitation', () => {
      component.user = new User({});
      component.household = new Household({ invites: [], inviteIds: [] });
      const user = new User({ uid: 'uid' });

      spyOn(householdService, 'update');
      spyOn(notificationService, 'setModal');

      component.sendInviteEvent(user);

      expect(householdService.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should do nothing without a valid user', () => {
      const user = undefined;

      spyOn(householdService, 'update');
      spyOn(notificationService, 'setModal');

      component.sendInviteEvent(user);

      expect(householdService.update).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('should clean a household', () => {
      const household = new Household({ members: [{ uid: '' }] });

      spyOn(validationService, 'setModal');

      component.removeMember(household.members[0]);

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeMemberEvent', () => {
    it('should clean a household', () => {
      const household = new Household({ members: [{ uid: '' }] });

      spyOn(component, 'cleanHousehold');
      spyOn(notificationService, 'setModal');

      component.removeMemberEvent(household.members[0]);

      expect(component.cleanHousehold).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('getInviterName', () => {
    it('should return an inviter name', () => {
      component.user = new User({ uid: 'uid' });
      const household = new Household({ invites: [{ uid: 'uid', inviterName: 'name' }] });

      const result = component.getInviterName(household);

      expect(result).toBeDefined();
    });

    it('should return undefined', () => {
      component.user = new User({ uid: 'uid2' });
      const household = new Household({ invites: [{ uid: 'uid' }] });

      const result = component.getInviterName(household);

      expect(result).toEqual('');
    });
  });

  describe('rejectInvite', () => {
    it('should update a household', () => {
      component.user = new User({});
      const household = new Household({ invites: [{ uid: 'uid' }], inviteIds: ['uid'] });

      spyOn(householdService, 'update');
      spyOn(notificationService, 'setModal');

      component.rejectInvite(household);

      expect(householdService.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('acceptInvite', () => {
    it('should fire a validation modal', () => {
      component.household = new Household({});
      const household = new Household({});

      spyOn(validationService, 'setModal');
      spyOn(component, 'acceptInviteEvent');

      component.acceptInvite(household);

      expect(validationService.setModal).toHaveBeenCalled();
      expect(component.acceptInviteEvent).not.toHaveBeenCalled();
    });

    it('should fire an event', () => {
      const household = new Household({});

      spyOn(validationService, 'setModal');
      spyOn(component, 'acceptInviteEvent');

      component.acceptInvite(household);

      expect(validationService.setModal).not.toHaveBeenCalled();
      expect(component.acceptInviteEvent).toHaveBeenCalled();
    });
  });

  describe('acceptInviteEvent', () => {
    it('should update a household', () => {
      component.user = new User({});
      const household = new Household({ invites: [{ uid: 'uid' }], inviteIds: ['uid'] });

      spyOn(householdService, 'update');
      spyOn(notificationService, 'setModal');
      spyOn(firebase, 'logEvent');

      component.acceptInviteEvent(household);

      expect(householdService.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
    });
  });
});
