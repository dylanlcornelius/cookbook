import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading = new BehaviorSubject<boolean>(false);

  get(): BehaviorSubject<boolean> {
    return this.loading;
  }
  set(loading: boolean): boolean {
    this.loading.next(loading);
    return loading;
  }
}
