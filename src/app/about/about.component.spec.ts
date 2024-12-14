import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ImageService } from '@imageService';
import { Recipe } from '@recipe';
import { RecipeService } from '@recipeService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';
import { AboutComponent } from './about.component';

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
      spyOn(recipeService, 'getAll').and.returnValue(of([new Recipe({ hasImage: true })]));
      spyOn(userService, 'getAll').and.returnValue(of([new User({})]));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(recipeService.getAll).toHaveBeenCalled();
      expect(userService.getAll).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should handle image errors', () => {
      spyOn(recipeService, 'getAll').and.returnValue(of([new Recipe({ hasImage: true })]));
      spyOn(userService, 'getAll').and.returnValue(of([new User({})]));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());

      component.load();

      expect(recipeService.getAll).toHaveBeenCalled();
      expect(userService.getAll).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });
  });
});
