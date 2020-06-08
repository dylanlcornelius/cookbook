import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';
import { Recipe } from '../shared/recipe.model';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('findUserRating', () => {
    it('should return a user rating', () => {
      const rating = {uid: 'uid', rating: 1}
      component.recipe = new Recipe({ratings: [rating]});
      component.uid = 'uid';

      const result = component.findUserRating();

      expect(result).toEqual(rating);
    });
  });

  describe('handleRate', () => {
    it('should do nothing if the rating is unselected', () => {
      component.userRating = {rating: 1, uid: 'uid'};
      component.uid = 'uid';
      component.recipe = new Recipe({rating: [{
        rating: 1,
        uid: 'uid'
      }]});

      spyOn(component.rate, 'emit');

      component.handleRate(1);

      expect(component.rate.emit).toHaveBeenCalledWith(0);
    });

    it('should emit a new rating value', () => {
      component.uid = 'uid';
      component.recipe = new Recipe({rating: [{
        rating: 2,
        uid: 'uid'
      }]});

      spyOn(component.rate, 'emit');

      component.handleRate(1);

      expect(component.rate.emit).toHaveBeenCalledWith(1);
    });
  });
});
