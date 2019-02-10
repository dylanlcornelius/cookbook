import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { IngredientsService} from '../../ingredients/ingredients.service';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {

  loading: Boolean = true;
  recipe = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService) { }

  ngOnInit() {
    this.getRecipeDetails(this.route.snapshot.params['id']);
  }

  getRecipeDetails(id) {
    this.recipesService.getRecipe(id)
      .subscribe(data => {
        // console.log(data);
        this.recipe = data;
        this.loading = false;
        // console.log(this.recipe);
      });
  }

  deleteRecipe(id) {
    this.recipesService.deleteRecipes(id)
      .subscribe(res => {
        this.router.navigate(['/recipes-list']);
      }, (err) => {
        console.error(err);
      });
  }

  // initIngredients() {
  //   this.ingredientsService.getIngredients()
  //     .subscribe(data => {
  //       // data.forEach(d => {
  //       //   this.ingredients.push({key: d.key, value: false});
  //       // });
  //       this.availableIngredients = data;
  //       // console.log(this.ingredients);
  //       console.log(this.availableIngredients);
  //     });
  // }
}
