import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../shared/recipe.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() recipe: Recipe = new Recipe({});
  @Input() uid: string;

  @Output() rate: EventEmitter<number> = new EventEmitter();

  userRating;
  getUserRating = () => (this.userRating || {rating: 0});

  ngOnChanges() {
    this.userRating = this.findUserRating();
  }

  findUserRating() {
    return this.recipe.ratings.find(rating => rating.uid === this.uid);
  }

  handleRate(newRating) {
    if (!this.userRating || this.userRating && this.userRating.rating !== newRating) {
      this.rate.emit(newRating);
    } else {
      this.rate.emit(0);
    }
  }
}
