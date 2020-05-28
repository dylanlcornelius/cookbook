import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';

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

  describe('calculateMeanRating', () => {
    it('should do nothing when ratings is not defined', () => {
      component.calculateMeanRating();

      expect(component.meanRating).toBeUndefined();
    });

    it('should set the average to zero when there are no ratings', () => {
      component.ratings = [];

      component.calculateMeanRating();

      expect(component.meanRating).toEqual(0);
    });

    it('should return the average of ratings', () => {
      component.ratings = [{
        rating: 1,
        uid: 'uid1'
      }, {
        rating: 2,
        uid: 'uid2'
      }];

      component.calculateMeanRating();

      expect(component.meanRating).toEqual(50);
    });
  });

  describe('handleRate', () => {
    it('should do nothing if the rating has not changed', () => {
      component.uid = 'uid';
      component.ratings = [{
        rating: 1,
        uid: 'uid'
      }];

      spyOn(component.rate, 'emit');

      component.handleRate(1);

      expect(component.rate.emit).not.toHaveBeenCalled();
    });

    it('should emit a new rating value', () => {
      component.uid = 'uid';
      component.ratings = [{
        rating: 2,
        uid: 'uid'
      }];

      spyOn(component.rate, 'emit');

      component.handleRate(1);

      expect(component.rate.emit).toHaveBeenCalled();
    });
  });
});
