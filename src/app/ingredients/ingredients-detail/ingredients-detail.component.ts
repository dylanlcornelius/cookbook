import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '../ingredient.service';

@Component({
  selector: 'app-ingredients-detail',
  templateUrl: './ingredients-detail.component.html',
  styleUrls: ['./ingredients-detail.component.css']
})
export class IngredientsDetailComponent implements OnInit {

  loading: Boolean = true;
  validationModalParams: {};
  ingredient;

  constructor(private route: ActivatedRoute, private router: Router, private ingredientService: IngredientService) { }

  ngOnInit() {
    this.getIngredientDetails(this.route.snapshot.params['id']);
  }

  getIngredientDetails(id) {
    this.ingredientService.getIngredient(id)
      .subscribe(data => {
        this.ingredient = data;
        this.loading = false;
      });
  }

  deleteIngredient(id) {
    this.validationModalParams = {
      function: this.deleteEvent,
      id: id,
      self: this,
      text: 'Are you sure you want to delete ingredient ' + this.ingredient.name + '?'
    };
  }

  deleteEvent = function(self, id) {
    if (id) {
      self.ingredientService.deleteIngredients(id)
      .subscribe(res => {
        self.router.navigate(['/ingredients-list']);
      }, (err) => {
        console.error(err);
      });
    }
  };
}
