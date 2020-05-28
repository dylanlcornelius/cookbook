import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../shared/recipe.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() ratings: Recipe["ratings"];
  @Input() uid: string;

  @Output() rate: EventEmitter<string> = new EventEmitter();

  meanRating: number;

  ngOnChanges() {
    this.calculateMeanRating();
  }

  calculateMeanRating() {
    if (!this.ratings) {
      return;
    }

    if (this.ratings.length === 0) {
      this.meanRating = 0;
      return;
    }
    
    this.meanRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0) / this.ratings.length / 3 * 100;
  }

  handleRate(newRating) {
    const userRating = this.ratings.find(rating => rating.uid === this.uid);
    if (!userRating || userRating && userRating.rating != newRating) {
      this.rate.emit(newRating);
    }
  }
}
