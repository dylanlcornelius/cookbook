import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { IngredientService} from '../../ingredients/ingredient.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {

  loading: Boolean = true;
  recipe = {};
  ingredients = [];
  user = {};

  constructor(private route: ActivatedRoute,
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
            allIngredients.forEach(i => {
              data.ingredients.forEach(recipeIngredient => {
                if (recipeIngredient.key === i.key) {
                  this.ingredients.push({name: i.name, key: i.key});
                }
              });
            });
            this.loading = false;
          });
        });
      });
  }

  deleteRecipe(id) {
    this.recipeService.deleteRecipes(id)
      .subscribe(res => {
        this.router.navigate(['/recipes-list']);
      }, (err) => {
        console.error(err);
      });
  }
}
