import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Recipe } from '@recipe';
import { User } from '@user';
import { of } from 'rxjs';
import { RecipeService } from '@recipeService';
import { UserService } from '@userService';
import { ImageService } from '@imageService';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let recipeService: RecipeService;
  let userService: UserService;
  let imageService: ImageService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [AboutComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    recipeService = TestBed.inject(RecipeService);
    userService = TestBed.inject(UserService);
    imageService = TestBed.inject(ImageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load recipes and authors', () => {
      spyOn(recipeService, 'get').and.returnValue(of([new Recipe({ hasImage: true })]));
      spyOn(userService, 'get').and.returnValue(of([new User({})]));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(recipeService.get).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should handle image errors', () => {
      spyOn(recipeService, 'get').and.returnValue(of([new Recipe({ hasImage: true })]));
      spyOn(userService, 'get').and.returnValue(of([new User({})]));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());

      component.load();

      expect(recipeService.get).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });
  });
});
