import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { Comment, CommentObject, Comments } from '@comment';
import { Action } from '@actions';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends FirestoreService<Comment> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('comments', (data) => new Comment(data), firebase, currentUserService, actionService);
  }

  getByDocument(id: string): Observable<Comments> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('documentId', '==', id)))
        .subscribe((docs) => {
          observer.next(docs.map((doc) => new Comment(doc)));
        });
    });
  }

  create = (data: Comment): string => super.create(data.getObject(), Action.CREATE_COMMENT);
  update = (data: CommentObject | Comments, id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id, Action.DELETE_COMMENT);
}
