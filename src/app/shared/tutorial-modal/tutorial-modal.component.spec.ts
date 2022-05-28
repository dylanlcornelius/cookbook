import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '@loadingService';
import { TutorialModalService } from '@modalService';
import { POSITION, Tutorial, TutorialModal } from '@tutorial';
import { TutorialService } from '@tutorialService';
import { BehaviorSubject, of } from 'rxjs';

import { TutorialModalComponent } from './tutorial-modal.component';

describe('TutorialModalComponent', () => {
  let component: TutorialModalComponent;
  let fixture: ComponentFixture<TutorialModalComponent>;
  let tutorialModalService: TutorialModalService;
  let tutorialService: TutorialService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      declarations: [ TutorialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialModalComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    tutorialModalService = TestBed.inject(TutorialModalService);
    tutorialService = TestBed.inject(TutorialService);
    loadingService = TestBed.inject(LoadingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load all tutorials and do nothing', () => {
      const tutorials = [
        new Tutorial({
          baseUrl: '/recipe/detail'
        })
      ];

      spyOn(tutorialModalService, 'getModal').and.returnValue(new BehaviorSubject(undefined));
      spyOn(tutorialService, 'get').and.returnValue(of(tutorials));
      spyOn(component, 'changeTutorial');

      component.load();

      expect(tutorialModalService.getModal).toHaveBeenCalled();
      expect(tutorialService.get).toHaveBeenCalled();
      expect(component.changeTutorial).not.toHaveBeenCalled();
    });


    it('should load all tutorials with a starting url', () => {
      const tutorials = [
        new Tutorial({
          baseUrl: '/recipe/detail'
        })
      ];

      spyOn(tutorialModalService, 'getModal').and.returnValue(new BehaviorSubject(new TutorialModal('/recipe/detail/test', '/recipe/detail/test')));
      spyOn(tutorialService, 'get').and.returnValue(of(tutorials));
      spyOn(component, 'changeTutorial');

      component.load();

      expect(tutorialModalService.getModal).toHaveBeenCalled();
      expect(tutorialService.get).toHaveBeenCalled();
      expect(component.changeTutorial).toHaveBeenCalled();
    });

    it('should load all tutorials with an unfound starting url', () => {
      const tutorials = [
        new Tutorial({
          baseUrl: '/recipe/list'
        })
      ];

      spyOn(tutorialModalService, 'getModal').and.returnValue(new BehaviorSubject(new TutorialModal('/recipe/detail/test', '/recipe/detail/test')));
      spyOn(tutorialService, 'get').and.returnValue(of(tutorials));
      spyOn(component, 'changeTutorial');

      component.load();

      expect(tutorialModalService.getModal).toHaveBeenCalled();
      expect(tutorialService.get).toHaveBeenCalled();
      expect(component.changeTutorial).toHaveBeenCalled();
    });

    it('should load all tutorials without a starting url', () => {
      const tutorials = [
        new Tutorial({
          baseUrl: '/recipe/detail'
        })
      ];

      spyOn(tutorialModalService, 'getModal').and.returnValue(new BehaviorSubject(new TutorialModal('/home', null)));
      spyOn(tutorialService, 'get').and.returnValue(of(tutorials));
      spyOn(component, 'changeTutorial');

      component.load();

      expect(tutorialModalService.getModal).toHaveBeenCalled();
      expect(tutorialService.get).toHaveBeenCalled();
      expect(component.changeTutorial).toHaveBeenCalled();
    });
  });

  describe('initModal', () => {
    it('should initialize a tutorial modal', fakeAsync(() => {
      component.tutorial = new Tutorial({});

      component.initModal();
      tick(100);

      expect(component.top).toBeDefined();
    }));

    it('should initialize a tutorial modal with an element', fakeAsync(() => {
      component.tutorial = new Tutorial({ element: 'body' });

      component.initModal();
      tick(100);

      expect(component.top).toBeDefined();
    }));

    it('should initialize a tutorial modal with a left positioned element', fakeAsync(() => {
      component.tutorial = new Tutorial({ element: 'body', position: POSITION.LEFT });

      component.initModal();
      tick(100);

      expect(component.top).toBeDefined();
    }));
  });

  describe('changeTutorial', () => {
    it('should handle changing to new routes', fakeAsync(() => {
      component.tutorial = new Tutorial({});
      component.tutorialIndex = 0;
      component.tutorials = [
        component.tutorial
      ];

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      spyOn(loadingService, 'get').and.returnValue(new BehaviorSubject(false));
      spyOn(component, 'initModal');

      component.changeTutorial();
      tick();

      expect(router.navigate).toHaveBeenCalled();
      expect(loadingService.get).toHaveBeenCalled();
      expect(component.initModal).toHaveBeenCalled();
    }));

    it('should handle changing to new routes while another component is loading', fakeAsync(() => {
      component.tutorial = new Tutorial({ element: 'body' });
      component.tutorialIndex = 0;
      component.tutorials = [
        component.tutorial
      ];

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      spyOn(loadingService, 'get').and.returnValue(new BehaviorSubject(true));
      spyOn(component, 'initModal');

      component.changeTutorial();
      tick();

      expect(router.navigate).toHaveBeenCalled();
      expect(loadingService.get).toHaveBeenCalled();
      expect(component.initModal).not.toHaveBeenCalled();
    }));

    it('should handle changing to the same route', () => {
      component.tutorial = new Tutorial({ url: '/' });
      component.tutorialIndex = 0;
      component.tutorials = [
        component.tutorial
      ];

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(loadingService, 'get');
      spyOn(component, 'initModal');

      component.changeTutorial();

      expect(router.navigate).not.toHaveBeenCalled();
      expect(loadingService.get).not.toHaveBeenCalled();
      expect(component.initModal).toHaveBeenCalled();
    });

    it('should handle changing to the same route with an unfindable element', () => {
      component.tutorial = new Tutorial({ url: '/', element: 'thing' });
      component.tutorialIndex = 0;
      component.tutorials = [
        component.tutorial
      ];

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(loadingService, 'get');
      spyOn(component, 'initModal');

      component.changeTutorial();

      expect(router.navigate).not.toHaveBeenCalled();
      expect(loadingService.get).not.toHaveBeenCalled();
      expect(component.initModal).toHaveBeenCalled();
    });
  });

  describe('previous', () => {
    it('should change to the previous tutorial', () => {
      component.tutorialIndex = 1;

      spyOn(component, 'changeTutorial');

      component.previous();

      expect(component.changeTutorial).toHaveBeenCalled();
    });

    it('should handle the first tutorial', () => {
      component.tutorialIndex = 0;

      spyOn(component, 'changeTutorial');

      component.previous();

      expect(component.changeTutorial).not.toHaveBeenCalled();
    });
  });

  describe('next', () => {
    it('should change to the next tutorial', () => {
      component.tutorialIndex = 0;
      component.tutorials = [
        new Tutorial({}),
        new Tutorial({})
      ];

      spyOn(component, 'close');
      spyOn(component, 'changeTutorial');

      component.next();

      expect(component.close).not.toHaveBeenCalled();
      expect(component.changeTutorial).toHaveBeenCalled();
    });

    it('should handle ending the tutorial', () => {
      component.tutorialIndex = 1;
      component.tutorials = [
        new Tutorial({}),
        new Tutorial({})
      ];

      spyOn(component, 'close');
      spyOn(component, 'changeTutorial');

      component.next();

      expect(component.close).toHaveBeenCalled();
      expect(component.changeTutorial).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close without an element', () => {
      component.params = new TutorialModal('');
      component.tutorial = new Tutorial({});

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(tutorialModalService, 'setModal');

      component.close();

      expect(router.navigate).toHaveBeenCalled();
      expect(tutorialModalService.setModal).toHaveBeenCalled();
    });

    it('should close with an element', () => {
      component.params = new TutorialModal('');
      component.tutorial = new Tutorial({ element: 'body' });

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(tutorialModalService, 'setModal');

      component.close();

      expect(router.navigate).toHaveBeenCalled();
      expect(tutorialModalService.setModal).toHaveBeenCalled();
    });

    it('should close with an unfindable element', () => {
      component.params = new TutorialModal('');
      component.tutorial = new Tutorial({ element: 'thing' });

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(tutorialModalService, 'setModal');

      component.close();

      expect(router.navigate).toHaveBeenCalled();
      expect(tutorialModalService.setModal).toHaveBeenCalled();
    });
  });
});
