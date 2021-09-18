import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Comment } from '@comment';
import { CommentService } from '@commentService';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User } from '@user';
import { UserService } from '@userService';
import { Validation } from '@validation';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  user: User;

  @Input() id: string;

  parentComments;
  childCommentsByParentId;
  comments;

  controls = [];

  constructor(
    private currentUserService: CurrentUserService,
    private commentService: CommentService,
    private userService: UserService,
    private validationService: ValidationService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    const user$ = this.currentUserService.getCurrentUser();
    const comments$ = this.commentService.get(this.id);
    const users$ = this.userService.get();

    combineLatest([user$, comments$, users$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, comments, users]) => {
      this.user = user;
      
      this.comments = comments
        .map(comment => ({ ...comment, authorName:users.find(({ uid }) => uid == comment.author)?.name }))
        .sort((a, b) => a.creationDate?.getTime() - b.creationDate?.getTime())
        .sort((a, b) => a.parent && b.parent || !a.parent && !b.parent ? 0 : !a.parent ? -1 : 1);

      this.parentComments = this.comments.filter(({ parent }) => !parent);
      this.childCommentsByParentId = this.comments
        .filter(({ parent }) => parent)
        .reduce((list, comment) => {
          if (!list[comment.parent]) {
            list[comment.parent] = [comment];
          } else {
            list[comment.parent].push(comment);
          }
          return list;
        }, {});

      this.controls = [];
      this.parentComments.forEach(() => {
        this.controls.push(new FormControl());
      });
      this.controls.push(new FormControl());
    });
  }

  addComment(text: string, parent?: string): void {
    this.commentService.create(new Comment({ documentId: this.id, text, author: this.user.uid, parent }));
    this.notificationService.setModal(new SuccessNotification('Comment added!'));
  }

  editComment(comment: Comment, text: string): void {
    comment.text = text;
    this.commentService.update(comment.getObject(), comment.getId());
    this.notificationService.setModal(new SuccessNotification('Comment resolved!'));
  }

  resolveComment(comment: Comment): void {
    comment.resolved = true;
    this.commentService.update(comment.getObject(), comment.getId());
    this.notificationService.setModal(new SuccessNotification('Comment resolved!'));
  }

  deleteComment(id: string): void {
    this.validationService.setModal(new Validation(
      'Are you sure you want to delete this comment?',
      this.deleteCommentEvent,
      [id]
    ));
  }

  deleteCommentEvent = (comment: Comment): void => {
    let commentsToDelete = [comment.id];

    const childComments = this.childCommentsByParentId[comment.id]?.map(({ id }) => id);
    if (!comment.parent && childComments) {
      commentsToDelete = commentsToDelete.concat(childComments);
    }

    commentsToDelete.forEach(comment => this.commentService.delete(comment));
    this.notificationService.setModal(new SuccessNotification('Comment deleted'));
  };
}
