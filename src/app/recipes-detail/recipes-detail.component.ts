import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FsService } from '../fs.service';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {

  loading: Boolean = true;
  recipe = {};

  constructor(private route: ActivatedRoute, private router: Router, private fs: FsService) { }

  ngOnInit() {
    this.getRecipeDetails(this.route.snapshot.params['id']);
  }

  getRecipeDetails(id) {
    this.fs.getRecipe(id)
      .subscribe(data => {
        // console.log(data);
        this.recipe = data;
        this.loading = false;
      });
  }

  deleteRecipe(id) {
    this.fs.deleteRecipes(id)
      .subscribe(res => {
        this.router.navigate(['/recipes']);
      }, (err) => {
        console.error(err);
      });
  }
}
