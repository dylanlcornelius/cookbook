import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialButtonComponent } from './tutorial-button.component';
import { TutorialService } from '@tutorialService';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TutorialButtonComponent', () => {
  let component: TutorialButtonComponent;
  let fixture: ComponentFixture<TutorialButtonComponent>;
  let tutorialService: TutorialService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorialButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tutorialService = TestBed.inject(TutorialService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openTutorial', () => {
    it('should open the tutorial', () => {
      spyOn(tutorialService, 'openTutorial');

      component.openTutorial();

      expect(tutorialService.openTutorial).toHaveBeenCalled();
    });
  });
});
