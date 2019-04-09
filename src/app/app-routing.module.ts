import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { IngredientsDetailComponent } from './ingredients/ingredients-detail/ingredients-detail.component';
import { IngredientEditComponent } from './ingredients/ingredient-edit/ingredient-edit.component';
import { AboutComponent } from './about/about.component';
import { LoginGuard } from './user/login/login.guard';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { ProfileComponent } from 'src/app/profile/profile/profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';
import { UserPendingGuard } from './user/user-pending/user-pending.guard';
import { ShoppingListComponent } from './shopping-list/shopping-list/shopping-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'recipes-list', component: RecipesListComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'recipes-detail/:id', component: RecipesDetailComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'recipe-edit', redirectTo: 'recipe-edit/', pathMatch: 'full'},
  {path: 'recipe-edit/:id', component: RecipeEditComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'ingredients-list', component: IngredientsListComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'ingredients-detail/:id', component: IngredientsDetailComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'ingredient-edit', redirectTo: 'ingredient-edit/', pathMatch: 'full'},
  {path: 'ingredient-edit/:id', component: IngredientEditComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'shopping-list', component: ShoppingListComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'about', component: AboutComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'user-pending', component: UserPendingComponent, canActivate: [LoginGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [LoginGuard, UserPendingGuard, AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
