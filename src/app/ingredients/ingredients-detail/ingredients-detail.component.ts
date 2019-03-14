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
  ingredient = {};

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
    this.ingredientService.deleteIngredients(id)
      .subscribe(res => {
        this.router.navigate(['/ingredients-list']);
      }, (err) => {
        console.error(err);
      });
  }
}
