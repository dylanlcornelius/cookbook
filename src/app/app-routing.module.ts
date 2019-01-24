import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';
import { RecipesCreateComponent } from './recipes-create/recipes-create.component';
import { RecipesUpdateComponent } from './recipes-update/recipes-update.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { ListComponent } from './list/list.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes-detail/:id', component: RecipesDetailComponent },
  { path: 'recipes-create', component: RecipesCreateComponent },
  { path: 'recipes-update/:id', component: RecipesUpdateComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'list', component: ListComponent },
  { path: 'about', component: AboutComponent },
  // data: { title: 'Create Boards' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
