import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
import { IngredientListComponent } from './ingredient/ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient/ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient/ingredient-edit/ingredient-edit.component';
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
  {path: 'recipe-list', component: RecipeListComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'recipe-detail/:id', component: RecipeDetailComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'recipe-edit', redirectTo: 'recipe-edit/', pathMatch: 'full'},
  {path: 'recipe-edit/:id', component: RecipeEditComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'ingredient-list', component: IngredientListComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'ingredient-detail/:id', component: IngredientDetailComponent, canActivate: [LoginGuard, UserPendingGuard]},
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
