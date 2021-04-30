import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '@config';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends FirestoreService {
  get ref() {
    return super.getRef('configs');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  get(name: string): Observable<Config>;
  get(): Observable<Config[]>;
  get(name?: string): Observable<Config | Config[]> {
    return new Observable(observer => {
      if (name) {
        super.get(this.ref?.where('name', '==', name)).subscribe(docs => {
          observer.next(new Config(docs[0]));
        });
      } else {
        super.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new Config(doc)));
        });
      }
    });
}

  create = (data: Config): string => super.create(this.ref, data);
  update = (data: Config[]) => super.updateAll(this.ref, data);
  delete = (id: string) => super.delete(this.ref, id);
}
