import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { UserPendingComponent } from './user/user-pending/user-pending.component';

import { LoginGuard } from './user/shared/login.guard';
import { UserPendingGuard } from './user/shared/user-pending.guard';
import { AdminGuard } from './admin/shared/admin.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'user-pending', component: UserPendingComponent, canActivate: [LoginGuard]},
  {path: 'recipe', loadChildren: './recipe/recipe.module#RecipeModule', canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'ingredient', loadChildren: './ingredient/ingredient.module#IngredientModule', canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'shopping', loadChildren: './shopping/shopping.module#ShoppingModule', canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'about', loadChildren: './about/about.module#AboutModule', canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'profile', loadChildren: './profile/profile.module#ProfileModule', canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivateChild: [LoginGuard, UserPendingGuard, AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
