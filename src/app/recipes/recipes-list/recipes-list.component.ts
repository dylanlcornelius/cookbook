import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  loading: Boolean = true;
  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity'];
  // dataSource = new RecipeDataSource(this.fs);
  dataSource = [];

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe((result) => {
      this.dataSource = result;
      this.loading = false;
    });
  }
}

// export class RecipeDataSource extends DataSource<any> {

//   constructor(private fs: FsService) {
//     super();
//   }

//   connect() {
//     // return this.fs.getRecipes();
//   }

//   disconnect() {}
// }
