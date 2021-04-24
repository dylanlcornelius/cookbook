import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileListComponent } from './profile-list.component';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '@userService';
import { RecipeService } from '@recipeService';
import { ImageService } from 'src/app/util/image.service';
import { User } from 'src/app/user/shared/user.model';
import { of } from 'rxjs';
import { Recipe } from 'src/app/recipe/shared/recipe.model';

describe('ProfileListComponent', () => {
  let component: ProfileListComponent;
  let fixture: ComponentFixture<ProfileListComponent>;
  let userService: UserService;
  let recipeService: RecipeService;
  let imageService: ImageService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      declarations: [ ProfileListComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    recipeService = TestBed.inject(RecipeService);
    imageService = TestBed.inject(ImageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load all users with images', () => {
      const users = [
        new User({uid: 'uid', firstName: 'a'}),
        new User({uid: 'uid2', firstName: 'b'}),
      ];
      const recipes = [
        new Recipe({uid: 'uid', ratings: [{uid: 'uid'}]}),
        new Recipe({uid: 'uid'}),
      ];

      spyOn(userService, 'get').and.returnValue(of(users));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(userService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should load all users with images', () => {
      const users = [
        new User({firstName: 'b'}),
        new User({firstName: 'a'}),
      ];
      const recipes = [
        new Recipe({}),
        new Recipe({}),
      ];

      spyOn(userService, 'get').and.returnValue(of(users));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());

      component.load();

      expect(userService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should apply a filter', () => {
      component.dataSource = new MatTableDataSource([]);

      component.applyFilter('filter');

      expect(component.dataSource.filter).toEqual('filter');
    });

    it('should apply a filter and go to the first page', () => {
      component.dataSource = {paginator: {firstPage: () => {}}};

      spyOn(component.dataSource.paginator, 'firstPage');

      component.applyFilter('filter');

      expect(component.dataSource.filter).toEqual('filter');
      expect(component.dataSource.paginator.firstPage).toHaveBeenCalled();
    });
  });
});
