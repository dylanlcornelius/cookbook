import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FirestoreService } from '@firestoreService';
import { TutorialModalService } from '@modalService';
import { Tutorial } from '@tutorial';
import { of } from 'rxjs';

import { TutorialService } from './tutorial.service';
import { FirebaseService } from '@firebaseService';

describe('TutorialService', () => {
  let service: TutorialService;
  let tutorialModalService: TutorialModalService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
    });
    service = TestBed.inject(TutorialService);
    tutorialModalService = TestBed.inject(TutorialModalService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Tutorial({}).getObject());

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new Tutorial({}).getObject(), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Tutorial({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });

  describe('sort', () => {
    it('should sort two documents', () => {
      const result = service.sort(new Tutorial({ order: 1 }), new Tutorial({ order: 2 }));

      expect(result).toEqual(-1);
    });
  });

  describe('openTutorial', () => {
    it('should open the tutorial modal', () => {
      spyOn(service, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(tutorialModalService, 'setModal');

      service.openTutorial(false);

      expect(service.commitAction).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
      expect(tutorialModalService.setModal).toHaveBeenCalled();
    });

    it('should open the tutorial modal with a starting url', () => {
      spyOn(service, 'commitAction');
      spyOn(firebase, 'logEvent');
      spyOn(tutorialModalService, 'setModal');

      service.openTutorial(true);

      expect(service.commitAction).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
      expect(tutorialModalService.setModal).toHaveBeenCalled();
    });
  });
});
