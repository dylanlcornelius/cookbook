import { Injectable } from '@angular/core';
import { query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { Comment, CommentObject } from '@comment';
import { Action } from '@actions';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends FirestoreService {
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super('comments', currentUserService, actionService);
  }

  get(id: string): Observable<Comment[]>;
  get(): Observable<Comment[]>;
  get(id?: string): Observable<Comment[]>; // type for spyOn
  get(id?: string): Observable<Comment[]> {
    return new Observable(observer => {
      if (id) {
        super.getMany(query(this.ref, where('documentId', '==', id))).subscribe(docs => {
          observer.next(docs.map(doc => new Comment(doc)));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new Comment(doc)));
        });
      }
    });
  }

  create = (data: Comment): string => super.create(data.getObject(), Action.CREATE_COMMENT);
  update = (data: CommentObject | Comment[], id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id, Action.DELETE_COMMENT);
}
