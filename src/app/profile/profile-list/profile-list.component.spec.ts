import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ImageService } from '@imageService';
import { Recipe } from '@recipe';
import { RecipeService } from '@recipeService';
import { User } from '@user';
import { UserService } from '@userService';
import { UtilService } from '@utilService';
import { of } from 'rxjs';
import { ProfileListComponent } from './profile-list.component';

describe('ProfileListComponent', () => {
  let component: ProfileListComponent;
  let fixture: ComponentFixture<ProfileListComponent>;
  let userService: UserService;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let utilService: UtilService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ProfileListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    userService = TestBed.inject(UserService);
    recipeService = TestBed.inject(RecipeService);
    imageService = TestBed.inject(ImageService);
    utilService = TestBed.inject(UtilService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setAuthorFilter', () => {
    it('should set an author filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setAuthorFilter('filter');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('load', () => {
    it('should load all users with images', () => {
      const users = [
        new User({ uid: 'uid', firstName: 'a' }),
        new User({ uid: 'uid2', firstName: 'b' }),
      ];
      const recipes = [
        new Recipe({ uid: 'uid', ratings: [{ uid: 'uid' }] }),
        new Recipe({ uid: 'uid' }),
      ];

      spyOn(userService, 'getAll').and.returnValue(of(users));
      spyOn(recipeService, 'getAll').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(userService.getAll).toHaveBeenCalled();
      expect(recipeService.getAll).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should load all users with images', () => {
      const users = [new User({ firstName: 'b' }), new User({ firstName: 'a' })];
      const recipes = [new Recipe({}), new Recipe({})];

      spyOn(userService, 'getAll').and.returnValue(of(users));
      spyOn(recipeService, 'getAll').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());

      component.load();

      expect(userService.getAll).toHaveBeenCalled();
      expect(recipeService.getAll).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should handle image error', () => {
      const users = [new User({ firstName: 'b' }), new User({ firstName: 'a' })];
      const recipes = [new Recipe({}), new Recipe({})];

      spyOn(userService, 'getAll').and.returnValue(of(users));
      spyOn(recipeService, 'getAll').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());

      component.load();

      expect(userService.getAll).toHaveBeenCalled();
      expect(recipeService.getAll).toHaveBeenCalled();
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
      component.dataSource = { paginator: { firstPage: () => {} } } as MatTableDataSource<User>;

      spyOn(component.dataSource.paginator, 'firstPage' as never);

      component.applyFilter('filter');

      expect(component.dataSource.filter).toEqual('filter');
      expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
    });
  });
});
