import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientsService } from '../ingredients.service';

@Component({
  selector: 'app-ingredients-detail',
  templateUrl: './ingredients-detail.component.html',
  styleUrls: ['./ingredients-detail.component.css']
})
export class IngredientsDetailComponent implements OnInit {

  loading: Boolean = true;
  ingredient = {};

  constructor(private route: ActivatedRoute, private router: Router, private ingredientsService: IngredientsService) { }

  ngOnInit() {
    this.getIngredientDetails(this.route.snapshot.params['id']);
  }

  getIngredientDetails(id) {
    this.ingredientsService.getIngredient(id)
      .subscribe(data => {
        // console.log(data);
        this.ingredient = data;
        this.loading = false;
      });
  }

  deleteIngredient(id) {
    this.ingredientsService.deleteIngredients(id)
      .subscribe(res => {
        this.router.navigate(['/ingredients']);
      }, (err) => {
        console.error(err);
      });
  }
}
