import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';
import { RecipesCreateComponent } from './recipes-create/recipes-create.component';
import { RecipesUpdateComponent } from './recipes-update/recipes-update.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { ListComponent } from './list/list.component';
import { AboutComponent } from './about/about.component';
import { LoggedInGuard } from './guards/logged-in-guard.guard';

const routes: Routes = [
  // TODO: Login Guard Home page or not?
  { path: '', component: HomeComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'recipes', component: RecipesComponent, canActivate: [LoggedInGuard] },
  { path: 'recipes-detail/:id', component: RecipesDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'recipes-create', component: RecipesCreateComponent },
  { path: 'recipes-update/:id', component: RecipesUpdateComponent, canActivate: [LoggedInGuard] },
  { path: 'ingredients', component: IngredientsComponent, canActivate: [LoggedInGuard] },
  { path: 'list', component: ListComponent, canActivate: [LoggedInGuard] },
  { path: 'about', component: AboutComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
