import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from './config.model';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
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

  create(data: Config): string {
    return super.create(this.ref, data);
  }

  update(data: Config | Array<Config>) {
    if (!Array.isArray(data)) {
      super.update(this.ref, data.getId(), data.getObject());
    } else {
      super.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    super.delete(this.ref, id);
  }
}
