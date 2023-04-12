import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TitleService } from './title.service';
import { Router, TitleStrategy } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: ''
})
export class MockComponent { }

describe('TitleService', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TitleStrategy,
          useClass: TitleService
        }
      ]
    });
    router = TestBed.inject(Router);
  });

  describe('updateTitle', () => {
    it('should set a page title', fakeAsync(() => {
      router.resetConfig([
        { path: 'home', title: 'Home', component: MockComponent },
      ]);
      router.navigateByUrl('/home');
      tick();

      expect(document.title).toEqual('Home - Dev Cookbook');
    }));
  });
});
