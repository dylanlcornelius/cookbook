import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { IngredientService} from '../../ingredient/ingredient.service';
import { UserService } from '../../user/user.service';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  loading = true;
  validationModalParams;
  notificationModalParams;

  recipe;
  ingredients = [];
  user = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getRecipeDetails(this.route.snapshot.params['id']);
  }

  getRecipeDetails(id) {
    this.recipeService.getRecipe(id)
      .subscribe(data => {
        this.recipe = data;
        this.userService.getUser(data.user).subscribe(user => {
          this.user = user;
          if (!this.user) {
            this.user = { firstName: '', lastName: ''};
          }
          this.ingredientService.getIngredients()
          .subscribe(allIngredients => {
            data.ingredients.forEach(recipeIngredient => {
              allIngredients.forEach(ingredient => {
                if (recipeIngredient.id === ingredient.id) {
                  this.ingredients.push({
                    id: ingredient.id,
                    name: ingredient.name,
                    uom: recipeIngredient.uom,
                    quantity: recipeIngredient.quantity
                  });
                }
              });
            });
            this.loading = false;
          });
        });
      });
  }

  deleteRecipe(id) {
    this.validationModalParams = {
      function: this.deleteEvent,
      id: id,
      self: this,
      text: 'Are you sure you want to delete recipe ' + this.recipe.name + '?'
    };
  }

  deleteEvent = function(self, id) {
    if (id) {
      self.recipeService.deleteRecipes(id)
      .subscribe(res => {
        self.notificationModalParams = {
          self: self,
          type: Notification.SUCCESS,
          path: '/recipe-list',
          text: 'Recipe Deleted!'
        };
      }, (err) => {
        console.error(err);
      });
    }
  };
}
