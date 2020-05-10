import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { Notification } from '@notifications';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit {
  loading: Boolean = true;
  validationModalParams;
  notificationModalParams;
  ingredient;

  constructor(private route: ActivatedRoute, private ingredientService: IngredientService) { }

  ngOnInit() {
    this.ingredientService.getIngredient(this.route.snapshot.params['id']).then(data => {
      this.ingredient = data;
      this.loading = false;
    });
  }

  deleteIngredient(id) {
    this.validationModalParams = {
      id: id,
      self: this,
      text: 'Are you sure you want to delete ingredient ' + this.ingredient.name + '?',
      function: this.deleteIngredientEvent
    };
  }

  deleteIngredientEvent(self, id) {
    if (id) {
      self.ingredientService.deleteIngredient(id);
      self.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        path: '/ingredient/list',
        text: 'Ingredient deleted!'
      };
    }
  }
}
