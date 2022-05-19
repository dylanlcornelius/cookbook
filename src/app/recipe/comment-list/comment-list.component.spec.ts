import { ActionService } from '@actionService';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Comment } from '@comment';
import { CommentService } from '@commentService';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';

import { CommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let currentUserService: CurrentUserService;
  let commentService: CommentService;
  let userService: UserService;
  let actionService: ActionService;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [ CommentListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    commentService = TestBed.inject(CommentService);
    userService = TestBed.inject(UserService);
    actionService = TestBed.inject(ActionService);
    validationService = TestBed.inject(ValidationService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should comments', () => {
      const user = new User({ uid: 'uid', firstName: 'name' });
      const comments = [
        new Comment({ id: 'id1', author: 'uid' }),
        new Comment({}),
        new Comment({ parent: 'id1', creationDate: { toDate: () => { return new Date(); } } }),
        new Comment({ parent: 'id1', creationDate: { toDate: () => { return new Date(); } } }),
        new Comment({ creationDate: { toDate: () => { return new Date(); } } }),
        new Comment({ creationDate: { toDate: () => { return new Date(new Date().getDate() + 1); } } }),
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(commentService, 'get').and.returnValue(of(comments));
      spyOn(userService, 'get').and.returnValue(of([user]));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(commentService.get).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
    });
  });

  describe('toggleResolved', () => {
    it('should toggle the resolved flag', () => {
      const comment = new Comment({});

      component.toggleResolved(comment);

      expect(comment.showResolved).toBeTrue();
    });
  });

  describe('toggleEdit', () => {
    it('should toggle the resolved flag', () => {
      const comment = new Comment({});

      component.toggleEdit(comment);

      expect(comment.isEditing).toBeTrue();
    });
  });

  describe('addComment', () => {
    it('should create a new comment', () => {
      component.user = new User({});

      spyOn(commentService, 'create');
      spyOn(notificationService, 'setModal');

      component.addComment('text', 'parent');

      expect(commentService.create).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('editComment', () => {
    it('should update comment text', () => {
      component.user = new User({});
      const comment = new Comment({ text: 'a' });

      spyOn(commentService, 'update');
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      component.editComment(comment, 'b');

      expect(commentService.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('resolveComment', () => {
    it('should update comment resolution', () => {
      component.user = new User({});
      const comment = new Comment({ resolved: false });

      spyOn(commentService, 'update');
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      component.resolveComment(comment);

      expect(commentService.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should fire a validation modal', () => {
      spyOn(validationService, 'setModal');

      component.deleteComment('id');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('deleteCommentEvent', () => {
    it('should delete a comment and all child comments', () => {
      component.childCommentsByParentId = {
        'id1': [
          new Comment({ id: 'id2', parent: 'id1' }),
          new Comment({ id: 'id3', parent: 'id1' }),
        ],
        'id4': [
          new Comment({ id: 'id5', parent: 'id4' }),
        ]
      };

      spyOn(commentService, 'delete');
      spyOn(notificationService, 'setModal');

      component.deleteCommentEvent(new Comment({ id: 'id1' }));

      expect(commentService.delete).toHaveBeenCalledTimes(3);
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should delete a comment with no children', () => {
      component.childCommentsByParentId = {
        'id4': [
          new Comment({ id: 'id5', parent: 'id4' }),
        ]
      };

      spyOn(commentService, 'delete');
      spyOn(notificationService, 'setModal');

      component.deleteCommentEvent(new Comment({ id: 'id1' }));

      expect(commentService.delete).toHaveBeenCalledTimes(1);
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should delete a child comment', () => {
      component.childCommentsByParentId = {
        'id1': [
          new Comment({ id: 'id2', parent: 'id1' }),
          new Comment({ id: 'id3', parent: 'id1' }),
          
        ],
        'id4': [
          new Comment({ id: 'id5', parent: 'id4' }),
        ]
      };

      spyOn(commentService, 'delete');
      spyOn(notificationService, 'setModal');

      component.deleteCommentEvent(new Comment({ id: 'id2', parent: 'id1' }));

      expect(commentService.delete).toHaveBeenCalledTimes(1);
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
